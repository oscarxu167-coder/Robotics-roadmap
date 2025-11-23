// USACO Bronze Visualizer - Main JavaScript

class Visualizer {
    constructor() {
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d');
        this.currentProblem = 'simulation';
        this.isPlaying = false;
        this.animationId = null;
        this.step = 0;
        this.speed = 5;
        this.data = [];
        this.history = [];
        this.currentFrame = 0;
        
        // Statistics
        this.stats = {
            steps: 0,
            comparisons: 0,
            swaps: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadProblem('simulation');
    }
    
    setupEventListeners() {
        // Problem selection
        document.querySelectorAll('.problem-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.problem-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.loadProblem(e.target.dataset.problem);
            });
        });
        
        // Controls
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());
        document.getElementById('step-btn').addEventListener('click', () => this.stepForward());
        document.getElementById('play-btn').addEventListener('click', () => this.play());
        document.getElementById('pause-btn').addEventListener('click', () => this.pause());
        
        // Speed control
        document.getElementById('speed').addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value, 10);
            document.getElementById('speed-value').textContent = this.speed;
        });
        
        // Input controls
        document.getElementById('load-input-btn').addEventListener('click', () => this.loadCustomInput());
        document.getElementById('generate-random-btn').addEventListener('click', () => this.generateRandom());
        
        // Sample problems
        document.querySelectorAll('.load-problem-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.loadSampleProblem(e.target.dataset.problemId);
            });
        });
    }
    
    loadProblem(problemType) {
        this.currentProblem = problemType;
        this.reset();
        
        const problems = {
            simulation: {
                title: "Cow Movement Simulation",
                description: "Visualize how cows move in a barn.",
                explanation: `
                    <p><strong>Simulation Problems:</strong> These problems require you to follow a set of rules step by step.</p>
                    <ol>
                        <li>Read the initial state</li>
                        <li>Apply the transformation rules for each step</li>
                        <li>Track the state changes</li>
                        <li>Check the final state or count iterations</li>
                    </ol>
                    <p>Example: Cows at positions move according to rules, track their positions over time.</p>
                `
            },
            sorting: {
                title: "Bubble Sort Visualization",
                description: "Watch how bubble sort organizes data step by step.",
                explanation: `
                    <p><strong>Sorting Algorithm - Bubble Sort:</strong></p>
                    <ol>
                        <li>Compare adjacent elements</li>
                        <li>Swap them if they're in the wrong order</li>
                        <li>Repeat for all elements</li>
                        <li>Continue until no swaps are needed</li>
                    </ol>
                    <p>Time Complexity: O(n²) - Good for learning, not for competition!</p>
                    <p><code>USACO Tip:</code> Often you can use built-in sort functions!</p>
                `
            },
            grid: {
                title: "Grid Traversal - Flood Fill",
                description: "Explore connected regions in a grid.",
                explanation: `
                    <p><strong>Grid/Graph Traversal:</strong> Common in USACO Bronze!</p>
                    <ol>
                        <li>Start at a position in the grid</li>
                        <li>Mark current position as visited</li>
                        <li>Explore all adjacent cells (up, down, left, right)</li>
                        <li>Recursively visit unvisited valid cells</li>
                    </ol>
                    <p>Applications: Count regions, find paths, measure areas</p>
                    <p><code>USACO Example:</code> Counting cow pastures, lake sizes</p>
                `
            },
            array: {
                title: "Array Manipulation",
                description: "Track changes to array elements.",
                explanation: `
                    <p><strong>Array Operations:</strong> Foundation of many USACO problems</p>
                    <ol>
                        <li>Initialize array with values</li>
                        <li>Perform operations (rotate, shift, update ranges)</li>
                        <li>Track intermediate states</li>
                        <li>Output final result</li>
                    </ol>
                    <p>Common Operations: Prefix sums, sliding windows, rotations</p>
                `
            }
        };
        
        const problem = problems[problemType];
        document.getElementById('problem-title').textContent = problem.title;
        document.getElementById('problem-description').textContent = problem.description;
        document.getElementById('algorithm-steps').innerHTML = problem.explanation;
        
        this.generateRandom();
    }
    
    generateRandom() {
        switch(this.currentProblem) {
            case 'simulation':
                this.data = Array.from({length: 5}, () => ({
                    x: Math.random() * 700 + 50,
                    y: Math.random() * 300 + 50,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    id: Math.floor(Math.random() * 100)
                }));
                break;
            case 'sorting':
                this.data = Array.from({length: 12}, () => Math.floor(Math.random() * 90) + 10);
                break;
            case 'grid':
                const size = 8;
                this.data = Array.from({length: size}, () => 
                    Array.from({length: size}, () => Math.random() > 0.3 ? 0 : 1)
                );
                break;
            case 'array':
                this.data = Array.from({length: 10}, () => Math.floor(Math.random() * 50) + 1);
                break;
        }
        this.reset();
    }
    
    loadCustomInput() {
        const input = document.getElementById('custom-input').value.trim();
        if (!input) {
            alert('Please enter some input data!');
            return;
        }
        
        try {
            if (this.currentProblem === 'sorting' || this.currentProblem === 'array') {
                this.data = input.split(/\s+/).map(Number).filter(n => !isNaN(n));
            } else if (this.currentProblem === 'grid') {
                const lines = input.split('\n').filter(l => l.trim());
                this.data = lines.map(line => 
                    line.trim().split('').map(c => c === '#' ? 1 : 0)
                );
            }
            this.reset();
        } catch (e) {
            alert('Error parsing input: ' + e.message);
        }
    }
    
    loadSampleProblem(problemId) {
        const problems = {
            'cow-signal': {
                type: 'grid',
                data: [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 1, 0]
                ]
            },
            'milk-pails': {
                type: 'simulation',
                data: Array.from({length: 3}, (_, i) => ({
                    x: 100 + i * 250,
                    y: 200,
                    vx: 0,
                    vy: 0,
                    id: i + 1
                }))
            },
            'lost-cow': {
                type: 'array',
                data: [1, 4, 2, 8, 5, 7]
            }
        };
        
        const problem = problems[problemId];
        if (problem) {
            // Switch to the appropriate problem type
            document.querySelectorAll('.problem-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.problem === problem.type) {
                    btn.classList.add('active');
                }
            });
            this.currentProblem = problem.type;
            this.data = JSON.parse(JSON.stringify(problem.data));
            this.loadProblem(problem.type);
        }
    }
    
    reset() {
        this.pause();
        this.currentFrame = 0;
        this.stats = { steps: 0, comparisons: 0, swaps: 0 };
        this.updateStats();
        this.history = [];
        this.prepareAnimation();
        this.draw();
    }
    
    prepareAnimation() {
        this.history = [];
        
        switch(this.currentProblem) {
            case 'simulation':
                this.prepareSimulation();
                break;
            case 'sorting':
                this.prepareBubbleSort();
                break;
            case 'grid':
                this.prepareFloodFill();
                break;
            case 'array':
                this.prepareArrayManipulation();
                break;
        }
    }
    
    prepareSimulation() {
        const maxSteps = 100;
        let state = JSON.parse(JSON.stringify(this.data));
        
        for (let i = 0; i < maxSteps; i++) {
            this.history.push(JSON.parse(JSON.stringify(state)));
            
            // Update positions
            state.forEach(cow => {
                cow.x += cow.vx;
                cow.y += cow.vy;
                
                // Bounce off walls
                if (cow.x < 30 || cow.x > 770) {
                    cow.vx *= -1;
                    cow.x = Math.max(30, Math.min(770, cow.x));
                }
                if (cow.y < 30 || cow.y > 370) {
                    cow.vy *= -1;
                    cow.y = Math.max(30, Math.min(370, cow.y));
                }
            });
        }
    }
    
    prepareBubbleSort() {
        let arr = [...this.data];
        this.history.push({arr: [...arr], comparing: [], swapping: []});
        
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                // Show comparison
                this.history.push({
                    arr: [...arr],
                    comparing: [j, j + 1],
                    swapping: []
                });
                
                if (arr[j] > arr[j + 1]) {
                    // Show swap
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    this.history.push({
                        arr: [...arr],
                        comparing: [],
                        swapping: [j, j + 1]
                    });
                }
            }
        }
        
        this.history.push({arr: [...arr], comparing: [], swapping: []});
    }
    
    prepareFloodFill() {
        if (!this.data.length || !this.data[0]) return;
        
        const rows = this.data.length;
        const cols = this.data[0].length;
        let visited = Array.from({length: rows}, () => Array(cols).fill(false));
        let fillOrder = [];
        
        const floodFill = (r, c, color) => {
            if (r < 0 || r >= rows || c < 0 || c >= cols) return;
            if (visited[r][c] || this.data[r][c] === 1) return;
            
            visited[r][c] = true;
            fillOrder.push({r, c, color});
            this.history.push({
                visited: visited.map(row => [...row]),
                current: {r, c},
                color: color
            });
            
            floodFill(r - 1, c, color);
            floodFill(r + 1, c, color);
            floodFill(r, c - 1, color);
            floodFill(r, c + 1, color);
        };
        
        this.history.push({visited: visited.map(row => [...row]), current: null, color: 0});
        
        let colorId = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!visited[r][c] && this.data[r][c] === 0) {
                    colorId++;
                    floodFill(r, c, colorId);
                }
            }
        }
    }
    
    prepareArrayManipulation() {
        let arr = [...this.data];
        this.history.push({arr: [...arr], highlight: []});
        
        // Perform a simple rotation visualization
        for (let i = 0; i < arr.length; i++) {
            this.history.push({
                arr: [...arr],
                highlight: [i]
            });
        }
        
        // Rotate array
        for (let rotation = 0; rotation < 3; rotation++) {
            const first = arr.shift();
            arr.push(first);
            this.history.push({
                arr: [...arr],
                highlight: [arr.length - 1]
            });
        }
    }
    
    stepForward() {
        if (this.currentFrame < this.history.length - 1) {
            this.currentFrame++;
            this.stats.steps++;
            
            // Track comparisons and swaps for sorting
            if (this.currentProblem === 'sorting' && this.history[this.currentFrame]) {
                const frame = this.history[this.currentFrame];
                if (frame.comparing && frame.comparing.length > 0) {
                    this.stats.comparisons++;
                }
                if (frame.swapping && frame.swapping.length > 0) {
                    this.stats.swaps++;
                }
            }
            
            this.updateStats();
            this.draw();
        }
    }
    
    play() {
        this.isPlaying = true;
        document.getElementById('play-btn').style.display = 'none';
        document.getElementById('pause-btn').style.display = 'inline-block';
        this.animate();
    }
    
    pause() {
        this.isPlaying = false;
        document.getElementById('play-btn').style.display = 'inline-block';
        document.getElementById('pause-btn').style.display = 'none';
        if (this.animationId) {
            clearTimeout(this.animationId);
        }
    }
    
    animate() {
        if (!this.isPlaying) return;
        
        this.stepForward();
        
        if (this.currentFrame < this.history.length - 1) {
            const delay = 1000 / this.speed;
            this.animationId = setTimeout(() => this.animate(), delay);
        } else {
            this.pause();
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!this.history.length) return;
        
        const frame = this.history[this.currentFrame] || this.history[0];
        
        switch(this.currentProblem) {
            case 'simulation':
                this.drawSimulation(frame);
                break;
            case 'sorting':
                this.drawSorting(frame);
                break;
            case 'grid':
                this.drawGrid(frame);
                break;
            case 'array':
                this.drawArray(frame);
                break;
        }
    }
    
    drawSimulation(state) {
        if (!state || !state.length) return;
        
        // Draw boundaries
        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(10, 10, 780, 380);
        
        // Draw cows
        state.forEach((cow, idx) => {
            this.ctx.fillStyle = `hsl(${idx * 60}, 70%, 60%)`;
            this.ctx.beginPath();
            this.ctx.arc(cow.x, cow.y, 20, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(cow.id, cow.x, cow.y);
        });
    }
    
    drawSorting(state) {
        if (!state || !state.arr) return;
        
        const arr = state.arr;
        const barWidth = 60;
        const gap = 5;
        const maxHeight = 350;
        const maxValue = Math.max(...arr);
        
        arr.forEach((value, idx) => {
            const x = idx * (barWidth + gap) + 20;
            const height = (value / maxValue) * maxHeight;
            const y = 380 - height;
            
            // Determine color
            let color = '#3b82f6';
            if (state.comparing && state.comparing.includes(idx)) {
                color = '#f59e0b';
            } else if (state.swapping && state.swapping.includes(idx)) {
                color = '#ef4444';
            }
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, barWidth, height);
            
            this.ctx.fillStyle = '#1e293b';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(value, x + barWidth / 2, y - 10);
        });
    }
    
    drawGrid(state) {
        if (!state || !this.data.length) return;
        
        const rows = this.data.length;
        const cols = this.data[0].length;
        const cellSize = Math.min(700 / cols, 380 / rows);
        const offsetX = (800 - cols * cellSize) / 2;
        const offsetY = (400 - rows * cellSize) / 2;
        
        const colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
            '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
        ];
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = offsetX + c * cellSize;
                const y = offsetY + r * cellSize;
                
                if (this.data[r][c] === 1) {
                    this.ctx.fillStyle = '#1e293b';
                } else if (state.visited && state.visited[r][c]) {
                    const colorIdx = state.color || 1;
                    this.ctx.fillStyle = colors[colorIdx % colors.length];
                } else {
                    this.ctx.fillStyle = '#e2e8f0';
                }
                
                this.ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
                
                if (state.current && state.current.r === r && state.current.c === c) {
                    this.ctx.strokeStyle = '#fbbf24';
                    this.ctx.lineWidth = 4;
                    this.ctx.strokeRect(x, y, cellSize - 2, cellSize - 2);
                }
            }
        }
    }
    
    drawArray(state) {
        if (!state || !state.arr) return;
        
        const arr = state.arr;
        const boxWidth = 60;
        const boxHeight = 60;
        const gap = 10;
        const startX = (800 - arr.length * (boxWidth + gap)) / 2;
        const y = 170;
        
        arr.forEach((value, idx) => {
            const x = startX + idx * (boxWidth + gap);
            
            // Box
            this.ctx.fillStyle = state.highlight && state.highlight.includes(idx) 
                ? '#3b82f6' 
                : '#e2e8f0';
            this.ctx.fillRect(x, y, boxWidth, boxHeight);
            
            // Border
            this.ctx.strokeStyle = '#64748b';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, boxWidth, boxHeight);
            
            // Value
            this.ctx.fillStyle = state.highlight && state.highlight.includes(idx)
                ? 'white'
                : '#1e293b';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(value, x + boxWidth / 2, y + boxHeight / 2);
            
            // Index
            this.ctx.fillStyle = '#64748b';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(idx, x + boxWidth / 2, y + boxHeight + 15);
        });
    }
    
    updateStats() {
        document.getElementById('step-count').textContent = this.stats.steps;
        document.getElementById('comparison-count').textContent = this.stats.comparisons;
        document.getElementById('swap-count').textContent = this.stats.swaps;
    }
}

// Initialize the visualizer when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new Visualizer();
});
