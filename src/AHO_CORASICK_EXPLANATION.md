# YES! This Project Uses Aho-Corasick Algorithm

## Quick Answer
**This simulator implements a TRUE Aho-Corasick automaton**, not simple pattern matching. Here's the proof:

## 🔑 Key Evidence

### 1. **Trie Structure** ✅
```typescript
// From /lib/aho-corasick.ts
export interface TrieNode {
  children: Map<string, TrieNode>;  // ← Trie structure
  failureLink: TrieNode | null;     // ← Aho-Corasick failure links
  output: number[];                  // ← Output function
}
```

### 2. **Failure Links (THE PROOF!)** ✅
This is what makes it Aho-Corasick, not naive matching:

```typescript
// Build failure links using BFS
build(): void {
  const queue: TrieNode[] = [];
  
  // BFS to construct failure links
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    for (const [char, child] of current.children) {
      // Find failure link (longest proper suffix)
      let failureNode = current.failureLink;
      while (failureNode !== this.root && 
             !failureNode!.children.has(char)) {
        failureNode = failureNode!.failureLink;  // ← Follow failure links
      }
      
      if (failureNode!.children.has(char)) {
        child.failureLink = failureNode!.children.get(char)!;
      }
      
      // Merge output functions
      child.output.push(...child.failureLink.output);  // ← Aho-Corasick
    }
  }
}
```

### 3. **Single-Pass O(n) Search** ✅
```typescript
search(text: string): { matches: Match[]; stateSequence: number[] } {
  let node = this.root;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // Follow failure links if no transition exists
    while (node !== this.root && !node.children.has(char)) {
      node = node.failureLink!;  // ← No backtracking in input!
    }
    
    // Move to next state
    if (node.children.has(char)) {
      node = node.children.get(char)!;
    }
    
    // Report all matches at this position
    for (const patternId of node.output) {
      matches.push(...);
    }
  }
  
  return { matches, stateSequence };
}
```

## 🆚 Comparison: Naive vs Aho-Corasick

### ❌ Naive Pattern Matching (NOT USED)
```typescript
// This is what we DON'T do:
function naiveSearch(text: string, patterns: string[]): Match[] {
  const matches = [];
  
  // Check each pattern separately
  for (const pattern of patterns) {
    // Scan entire input for each pattern
    for (let i = 0; i <= text.length - pattern.length; i++) {
      if (text.substring(i, i + pattern.length) === pattern) {
        matches.push({pattern, position: i});
      }
    }
  }
  
  return matches;  // O(n × m × k) - SLOW!
}
```

**Problems:**
- Scans input multiple times (once per pattern)
- 16 patterns = 16 full scans
- O(n × m × k) complexity

### ✅ Aho-Corasick (WHAT WE USE)
```typescript
// This is what we DO:
function ahoCorasickSearch(text: string): Match[] {
  const matches = [];
  let state = root;
  
  // SINGLE pass through input
  for (const char of text) {
    // Follow failure links (no backtracking!)
    while (state !== root && !state.children.has(char)) {
      state = state.failureLink;
    }
    
    // Move to next state
    if (state.children.has(char)) {
      state = state.children.get(char);
    }
    
    // Check ALL patterns at once!
    matches.push(...state.output);
  }
  
  return matches;  // O(n + m + z) - FAST!
}
```

**Advantages:**
- Single scan of input
- Checks all 16 patterns simultaneously
- O(n + m + z) complexity

## 📊 Performance Comparison

| Algorithm | Input Scans | Complexity | Used Here |
|-----------|-------------|------------|-----------|
| Naive | 16× (one per pattern) | O(n × m × k) | ❌ NO |
| Aho-Corasick | 1× (single pass) | O(n + m + z) | ✅ YES |

Where:
- n = input length
- m = total pattern length
- k = number of patterns
- z = number of matches

## 🎯 Example: How It Works

**Input:** `"SELECT * FROM users WHERE id=1 OR 1=1"`

### Naive Approach (16 passes):
```
Pass 1:  Check "OR 1=1"         → Found at position 35 ✓
Pass 2:  Check "DROP TABLE"     → Not found
Pass 3:  Check "UNION SELECT"   → Not found
...
Pass 16: Check "INFORMATION_SCHEMA" → Not found
```

### Aho-Corasick (1 pass):
```
Position 0: 'S' → state 0
Position 1: 'E' → state 0
Position 2: 'L' → state 0
...
Position 35: 'O' → state 1 (OR path started)
Position 36: 'R' → state 1 (continuing)
Position 37: ' ' → state 1 (continuing)
Position 38: '1' → state 1 (continuing)
Position 39: '=' → state 1 (continuing)
Position 40: '1' → state 6 (MATCH! "OR 1=1" detected)

Also checked all other 15 patterns in the same pass!
```

## 🏆 Real-World Usage

This same Aho-Corasick algorithm is used by:

- **Snort** - Network intrusion detection system
- **Suricata** - Network IDS/IPS
- **ClamAV** - Antivirus scanner
- **grep -F** - Fixed string search
- **Firewalls** - Packet inspection

## 🔬 How to Verify

1. Open the **Documentation** tab
2. Click **"Aho-Corasick"** tab
3. See the visual proof with:
   - Trie diagram showing structure
   - Failure links (red dashed lines)
   - TypeScript implementation code
   - Side-by-side comparison

Or check the code yourself:
- `/lib/aho-corasick.ts` - Full implementation
- Lines 56-88: `build()` function constructs failure links
- Lines 90-125: `search()` function uses failure links

## ✅ Conclusion

**YES, this is 100% Aho-Corasick algorithm!**

The key features that prove it:
1. ✅ Trie structure for patterns
2. ✅ Failure links built with BFS
3. ✅ Single-pass O(n) search
4. ✅ No backtracking in input
5. ✅ Output function merging
6. ✅ Multi-pattern matching

This is NOT simple substring search. This is a true DFA-based pattern matching automaton using the Aho-Corasick algorithm, exactly as used in professional network security tools.
