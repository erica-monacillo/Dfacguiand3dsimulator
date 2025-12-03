// Aho-Corasick Algorithm Implementation for SQL Injection Detection

export interface TrieNode {
  children: Map<string, TrieNode>;
  failureLink: TrieNode | null;
  output: number[]; // Pattern IDs that end at this node
}

export interface Pattern {
  id: number;
  pattern: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
}

export interface Match {
  patternId: number;
  position: number;
  pattern: Pattern;
}

export class AhoCorasick {
  private root: TrieNode;
  private patterns: Pattern[];

  constructor() {
    this.root = this.createNode();
    this.root.failureLink = this.root;
    this.patterns = [];
  }

  private createNode(): TrieNode {
    return {
      children: new Map(),
      failureLink: null,
      output: [],
    };
  }

  // Add a pattern to the trie
  addPattern(pattern: Pattern): void {
    this.patterns.push(pattern);
    let node = this.root;

    for (const char of pattern.pattern) {
      if (!node.children.has(char)) {
        node.children.set(char, this.createNode());
      }
      node = node.children.get(char)!;
    }

    node.output.push(pattern.id);
  }

  // Build failure links (Aho-Corasick algorithm)
  build(): void {
    const queue: TrieNode[] = [];

    // Initialize failure links for depth-1 nodes
    for (const [, child] of this.root.children) {
      child.failureLink = this.root;
      queue.push(child);
    }

    // BFS to build failure links
    while (queue.length > 0) {
      const current = queue.shift()!;

      for (const [char, child] of current.children) {
        queue.push(child);

        // Find failure link
        let failureNode = current.failureLink;

        while (failureNode !== this.root && !failureNode!.children.has(char)) {
          failureNode = failureNode!.failureLink;
        }

        if (failureNode!.children.has(char) && failureNode!.children.get(char) !== child) {
          child.failureLink = failureNode!.children.get(char)!;
        } else {
          child.failureLink = this.root;
        }

        // Merge outputs from failure link
        if (child.failureLink) {
          child.output.push(...child.failureLink.output);
        }
      }
    }
  }

  // Search for patterns in text with state tracking
  search(text: string): { matches: Match[]; stateSequence: number[] } {
    const matches: Match[] = [];
    const stateSequence: number[] = [0]; // Track state IDs
    let node = this.root;
    let stateId = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      // Follow failure links if no transition exists
      while (node !== this.root && !node.children.has(char)) {
        node = node.failureLink!;
        stateId = this.getStateId(node);
      }

      // Move to next state if transition exists
      if (node.children.has(char)) {
        node = node.children.get(char)!;
        stateId = this.getStateId(node);
      }

      stateSequence.push(stateId);

      // Record matches
      for (const patternId of node.output) {
        const pattern = this.patterns.find(p => p.id === patternId);
        if (pattern) {
          matches.push({
            patternId,
            position: i - pattern.pattern.length + 1,
            pattern,
          });
        }
      }
    }

    return { matches, stateSequence };
  }

  // Helper to assign unique state IDs (simplified)
  private getStateId(node: TrieNode): number {
    if (node === this.root) return 0;
    if (node.output.length > 0) return 6; // Accept state
    // Return a state ID based on which pattern category
    return Math.min(5, node.output.length + 1);
  }

  getPatterns(): Pattern[] {
    return this.patterns;
  }
}

// Normalize payload: uppercase and collapse whitespace
export function normalizePayload(text: string): string {
  return text
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Initialize SQL injection patterns
export function createSQLInjectionDetector(): AhoCorasick {
  const ac = new AhoCorasick();

  const patterns: Pattern[] = [
    {
      id: 0,
      pattern: 'OR 1=1',
      name: 'OR 1=1',
      description: 'Always-True Condition SQL Injection',
      severity: 'critical',
    },
    {
      id: 1,
      pattern: "OR '1'='1'",
      name: "OR '1'='1'",
      description: 'Always-True Using Strings',
      severity: 'critical',
    },
    {
      id: 2,
      pattern: 'OR TRUE',
      name: 'OR TRUE',
      description: 'Boolean Bypass',
      severity: 'critical',
    },
    {
      id: 3,
      pattern: 'DROP TABLE',
      name: 'DROP TABLE',
      description: 'Table Deletion Attack',
      severity: 'critical',
    },
    {
      id: 4,
      pattern: 'UNION SELECT',
      name: 'UNION SELECT',
      description: 'Data Extraction Attack',
      severity: 'high',
    },
    {
      id: 5,
      pattern: 'UNION ALL SELECT',
      name: 'UNION ALL SELECT',
      description: 'Bulk Data Dump',
      severity: 'high',
    },
    {
      id: 6,
      pattern: '--',
      name: 'SQL Comment (--)',
      description: 'Comment Injection - Ignore Rest of Query',
      severity: 'high',
    },
    {
      id: 7,
      pattern: '#',
      name: 'MySQL Comment (#)',
      description: 'MySQL Hash Comment',
      severity: 'high',
    },
    {
      id: 8,
      pattern: '/*',
      name: 'Block Comment Start',
      description: 'Start Block Comment',
      severity: 'medium',
    },
    {
      id: 9,
      pattern: '*/',
      name: 'Block Comment End',
      description: 'End Block Comment',
      severity: 'medium',
    },
    {
      id: 10,
      pattern: "ADMIN' --",
      name: 'Login Bypass',
      description: 'Login Bypass Payload',
      severity: 'critical',
    },
    {
      id: 11,
      pattern: "' OR '1'='1' --",
      name: 'Classic Auth Bypass',
      description: 'Classic Authentication Bypass',
      severity: 'critical',
    },
    {
      id: 12,
      pattern: '; DROP DATABASE',
      name: 'DROP DATABASE',
      description: 'Destroy Entire Database',
      severity: 'critical',
    },
    {
      id: 13,
      pattern: '; EXEC',
      name: 'EXEC Command',
      description: 'Command Execution via EXEC',
      severity: 'critical',
    },
    {
      id: 14,
      pattern: 'LOAD_FILE',
      name: 'LOAD_FILE',
      description: 'Read Server Files',
      severity: 'high',
    },
    {
      id: 15,
      pattern: 'INFORMATION_SCHEMA',
      name: 'INFORMATION_SCHEMA',
      description: 'Enumerate All Tables',
      severity: 'high',
    },
  ];

  patterns.forEach(pattern => ac.addPattern(pattern));
  ac.build();

  return ac;
}
