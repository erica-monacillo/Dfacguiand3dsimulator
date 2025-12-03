# DFA-Based SQL Injection Detector - Web Simulator

## ⚠️ IMPORTANT: This Uses TRUE Aho-Corasick Algorithm

**YES, this project implements a real Aho-Corasick automaton, not simple pattern matching!**

Key proof:
- ✅ Trie structure with failure links
- ✅ BFS-based failure link construction
- ✅ Single-pass O(n) pattern matching
- ✅ No input backtracking
- ✅ Multi-pattern simultaneous detection

See `/AHO_CORASICK_EXPLANATION.md` for detailed proof or check the "Aho-Corasick" tab in the Documentation panel.

---

## Overview
This is a comprehensive web-based 3D simulator that demonstrates DFA-based SQL injection detection using the Aho-Corasick algorithm. It provides an interactive, visual way to understand how automata theory applies to network security.

## Features Implemented

### 1. **3D DFA Visualizer**
- Interactive 3D visualization of the automaton state machine
- Real-time state highlighting as patterns are detected
- Rotatable view with play/pause controls
- Visual representation of state transitions and accepting states

### 2. **Network Packet Analyzer**
- Input field for custom payloads
- 10 pre-loaded example payloads (both malicious and clean)
- Real-time analysis with loading states
- History tracking of analyzed payloads

### 3. **Aho-Corasick Algorithm Implementation**
- Full TypeScript implementation of the Aho-Corasick pattern matching algorithm
- Trie-based structure with failure links
- O(n) time complexity for pattern matching
- Support for 16 distinct SQL injection signatures

### 4. **Pattern Library**
- Complete list of all 16 SQL injection patterns
- Severity classification (Critical, High, Medium)
- Pattern descriptions and attack types
- Color-coded severity indicators

### 5. **Detection Results Panel**
- Real-time threat detection alerts
- Detailed pattern match information
- Recommended security actions
- Clean payload confirmation

### 6. **State Transition Viewer**
- Step-by-step visualization of DFA traversal
- Character-by-character processing animation
- Play/Pause/Step controls
- Progress tracking and state display

### 7. **Statistics Dashboard**
- Characters processed counter
- Current DFA state indicator
- Pattern matches counter
- Threat level assessment (SAFE/MEDIUM/HIGH/CRITICAL)

### 8. **Documentation Panel**
- Project overview and objectives
- DFA structure explanation
- Algorithm implementation details
- Usage instructions and examples
- Complexity analysis

## SQL Injection Patterns Detected

1. **OR 1=1** - Always-True Condition
2. **OR '1'='1'** - String-based Always-True
3. **OR TRUE** - Boolean Bypass
4. **DROP TABLE** - Table Deletion
5. **UNION SELECT** - Data Extraction
6. **UNION ALL SELECT** - Bulk Data Dump
7. **--** (double dash) - SQL Comment
8. **#** - MySQL Comment
9. **/*** - Block Comment Start
10. ***/** - Block Comment End
11. **ADMIN' --** - Login Bypass
12. **' OR '1'='1' --** - Classic Auth Bypass
13. **; DROP DATABASE** - Database Destruction
14. **; EXEC** - Command Execution
15. **LOAD_FILE** - File Reading
16. **INFORMATION_SCHEMA** - Schema Enumeration

## Technical Stack

- **React** - UI framework
- **TypeScript** - Type-safe implementation
- **Tailwind CSS** - Styling
- **Canvas API** - 3D visualization rendering
- **Shadcn/ui** - UI components

## How It Works

1. **Pattern Building**: All SQL injection signatures are loaded into a trie structure
2. **Failure Links**: Aho-Corasick failure links are constructed using BFS
3. **Analysis**: Input payloads are normalized (uppercase, whitespace collapsed)
4. **Matching**: The algorithm processes each character, following transitions or failure links
5. **Detection**: When an accepting state is reached, the corresponding pattern is flagged
6. **Visualization**: All state transitions are tracked and displayed in real-time

## Usage Instructions

1. Navigate to the **Simulator** tab
2. Enter a network payload or select an example
3. Click "Analyze Payload"
4. Watch the 3D visualizer show state transitions
5. Review detection results and pattern matches
6. Use the State Transition Viewer to step through the DFA execution

## Project Alignment

This simulator directly addresses all project requirements:

✅ Regular expressions for SQL injection signatures
✅ DFA construction and visualization  
✅ Pattern matching simulation
✅ O(n) time complexity
✅ Multiple signature detection
✅ Network security demonstration
✅ Educational visualization

## Additional Features Beyond Requirements

- 3D interactive visualization (original requirement was 2D DFA diagrams)
- Real-time state transition animation
- Statistics dashboard
- Comprehensive documentation panel
- History tracking
- Multiple severity levels
- Step-by-step execution viewer

## Performance

- **Time Complexity**: O(n + m + z) where n = input length, m = total pattern length, z = matches
- **Space Complexity**: O(m × k) where k = alphabet size
- **Real-time Processing**: Instant analysis for typical network payloads

## Educational Value

This simulator helps students understand:
- How DFAs work in practice
- Pattern matching algorithms
- Network security applications
- Automata theory concepts
- Real-world intrusion detection systems

## Future Enhancements (Optional)

- Export analysis reports
- Custom pattern creation
- Network packet capture integration
- Performance benchmarking
- Multiple detection algorithms comparison