/**
 * @file es.js — Español latinoamericano.
 * Cada cadena de texto visible para el usuario está aquí.
 */

export default {
	title: "Algoritmos de Búsqueda de Caminos",
	tagline:
		"Visualizá cómo los algoritmos de búsqueda exploran una grilla — IA para Juegos · COS30002",
	description:
		"Un visualizador interactivo de BFS, DFS, Dijkstra, A*, Búsqueda Voraz, BFS Bidireccional e IDA*.",
	skipToMain: "Ir al contenido principal",
	toggleTheme: "Alternar tema oscuro/claro",
	toggleLocale: "Switch to English",
	toggleSidebarLeft: "Alternar panel de teoría",
	toggleSidebarRight: "Alternar panel de controles",

	algoNames: {
		bfs: "Búsqueda en Anchura (BFS)",
		dfs: "Búsqueda en Profundidad (DFS)",
		dijkstra: "Algoritmo de Dijkstra",
		astar: "A* (A-estrella)",
		greedy: "Búsqueda Voraz (Greedy)",
		bibfs: "BFS Bidireccional",
		idastar: "IDA* (A* con Profundización Iterativa)",
	},

	heuristicNames: {
		manhattan: "Manhattan",
		euclidean: "Euclídea",
		chebyshev: "Chebyshev",
		octile: "Octil",
	},

	controls: "Controles",
	algorithm: "Algoritmo",
	heuristic: "Heurística",
	speed: "Velocidad",
	speedSlow: "Lento",
	speedFast: "Rápido",
	diagonal: "Permitir movimiento diagonal",
	drawMode: "Modo de dibujo",
	modes: {
		wall: "Pared",
		erase: "Borrar",
		weight: "Peso",
		start: "Mover inicio",
		end: "Mover meta",
	},
	showWeightMode: "Modo de pesos",
	weightLevel: "Nivel de peso",
	maze: "Generador de laberinto",
	mazeRandom: "Paredes aleatorias",
	mazeRecursive: "Retroceso recursivo",
	actions: "Acciones",
	play: "Ejecutar",
	pause: "Pausar",
	step: "Paso",
	stop: "Detener",
	clearPath: "Limpiar camino",
	clearAll: "Limpiar todo",

	telemetry: "Métricas de ejecución",
	status: "Estado",
	statuses: {
		idle: "Inactivo — dibujá un laberinto y presioná Ejecutar",
		running: "Ejecutando…",
		paused: "Pausado",
		done: "Listo — camino encontrado",
		noPath: "No existe un camino",
	},
	visited: "Nodos visitados",
	pathLength: "Longitud del camino",
	elapsed: "Tiempo transcurrido",
	ms: "ms",
	cells: "celdas",

	legend: "Leyenda",
	legendStart: "Inicio",
	legendEnd: "Meta",
	legendWall: "Pared",
	legendWeight: "Peso (2–9)",
	legendOpen: "Frontera (conjunto abierto)",
	legendClosed: "Visitado (conjunto cerrado)",
	legendPath: "Camino más corto",
	legendBwdOpen: "Frontera inversa",
	legendBwdClosed: "Visitado inverso",

	kbHint:
		"Click/arrastrar para pintar · Click derecho para borrar · Espacio para ejecutar/pausar · S para avanzar paso a paso",

	theory: "Teoría",
	inGames: "En videojuegos",
	algoInfo: {
		bfs: {
			title: "Búsqueda en Anchura (BFS)",
			body: `BFS explora todos los nodos al nivel de profundidad actual antes de ir más lejos.
Usa una cola FIFO: los nodos se procesan en el orden exacto en que se descubren.
En una grilla sin pesos, garantiza el camino con menos saltos —
el resultado clásico de "distancia mínima en saltos" usado en ruteo de redes y mapas de tiles.`,
			props: [
				{ label: "Óptimo", value: "Sí — menos saltos", colour: "green" },
				{ label: "Completo", value: "Sí", colour: "green" },
				{ label: "Pesos", value: "Ignorados", colour: "orange" },
				{ label: "Heurística", value: "Ninguna", colour: "orange" },
			],
			games: [
				{
					title: "Pathfinding en mapas de tiles",
					body: "BFS es la base del relleno por inundación y el balde de pintura. También se usa para comprobaciones de accesibilidad en juegos de estrategia por turnos.",
				},
				{
					title: "Inicialización de NavMesh",
					body: 'BFS desde la posición del jugador determina qué regiones del NavMesh son alcanzables, como en la UI de "mostrar tiles alcanzables" de Into the Breach.',
				},
			],
		},
		dfs: {
			title: "Búsqueda en Profundidad (DFS)",
			body: `DFS sigue una rama tan profundo como sea posible antes de retroceder.
Usa una pila LIFO (o recursión). El camino que encuentra rara vez es el más corto.
DFS se usa principalmente para generación de laberintos, detección de ciclos y ordenamiento topológico.`,
			props: [
				{
					label: "Óptimo",
					value: "No — el camino puede ser más largo",
					colour: "red",
				},
				{ label: "Completo", value: "Sí (grafos finitos)", colour: "green" },
				{ label: "Pesos", value: "Ignorados", colour: "orange" },
				{ label: "Heurística", value: "Ninguna", colour: "orange" },
			],
			games: [
				{
					title: "Generación de laberintos",
					body: "El retroceso recursivo (DFS + orden aleatorio de vecinos) es el algoritmo de generación de laberintos más común en juegos de mazmorras procedurales.",
				},
				{
					title: "Coloreo de grafos",
					body: 'El coloreo de grafos basado en DFS divide un nivel en "zonas" para la conciencia de área de la IA sin el costo de un buscador de caminos completo.',
				},
			],
		},
		dijkstra: {
			title: "Algoritmo de Dijkstra",
			body: `El algoritmo de Dijkstra expande el nodo con el menor costo acumulado (g).
A diferencia de BFS, respeta los pesos de las aristas — el terreno más pesado cuesta más recorrer.
Es esencialmente A* con heurística cero, por lo que se expande uniformemente en todas las direcciones.`,
			props: [
				{ label: "Óptimo", value: "Sí — menor costo", colour: "green" },
				{
					label: "Completo",
					value: "Sí (pesos no negativos)",
					colour: "green",
				},
				{ label: "Pesos", value: "Respetados", colour: "green" },
				{ label: "Heurística", value: "Ninguna (h = 0)", colour: "orange" },
			],
			games: [
				{
					title: "Pathfinding con costo de terreno",
					body: "Los juegos de estrategia asignan costos de movimiento por tipo de terreno (bosque = 2, camino = 1). Dijkstra devuelve el camino de menor costo, no el de menor cantidad de saltos.",
				},
				{
					title: "Pesos en aristas de NavMesh",
					body: "Los agentes de NavMesh de Unreal Engine y Unity usan acumulación de costo tipo Dijkstra cuando se aplican modificadores de área (barro, agua, densidad de multitud).",
				},
			],
		},
		astar: {
			title: "Algoritmo A*",
			body: `A* combina el costo pagado hasta ahora (g) con una estimación heurística del costo restante (h).
f = g + h. Al elegir una heurística admisible (que nunca sobreestime),
A* garantiza optimalidad visitando muchos menos nodos que Dijkstra.
Es el algoritmo de pathfinding estándar de la industria en juegos comerciales.`,
			props: [
				{ label: "Óptimo", value: "Sí — con h admisible", colour: "green" },
				{ label: "Completo", value: "Sí", colour: "green" },
				{ label: "Pesos", value: "Respetados", colour: "green" },
				{
					label: "Heurística",
					value: "Manhattan / Euclídea / Chebyshev / Octil",
					colour: "blue",
				},
			],
			games: [
				{
					title: "Navegación de NPCs",
					body: "Todos los motores de juego principales (Unreal, Unity, Godot) usan A* o una variante en su pathfinder de NavMesh. La heurística octil es la elección estándar para grillas de tiles con movimiento diagonal.",
				},
				{
					title: "Estrategia en tiempo real",
					body: "StarCraft, Age of Empires y Warcraft III usaron variantes de A*. Los campos de flujo (usados en Planetary Annihilation) pre-calculan un gradiente A* para todo el mapa.",
				},
			],
		},
		greedy: {
			title: "Búsqueda Voraz",
			body: `La búsqueda voraz siempre expande el nodo que parece más cercano a la meta — usa solo h(n),
ignorando el costo pagado hasta ahora. Esto la hace muy rápida en espacios abiertos, pero
puede ser engañada por una heurística que apunte hacia una pared, produciendo caminos no óptimos.
Compará su conteo de visitados con el de A* para ver el compromiso.`,
			props: [
				{
					label: "Óptimo",
					value: "No — puede encontrar caminos más largos",
					colour: "red",
				},
				{ label: "Completo", value: "No garantizado", colour: "red" },
				{ label: "Pesos", value: "Ignorados", colour: "orange" },
				{ label: "Heurística", value: "Solo h(n)", colour: "blue" },
			],
			games: [
				{
					title: 'Comportamiento aproximado de "línea hacia el objetivo"',
					body: "La búsqueda voraz se usa a veces en juegos RTS para comportamientos de persecución de corto alcance donde la optimalidad exacta no es necesaria.",
				},
			],
		},
		bibfs: {
			title: "BFS Bidireccional",
			body: `Dos fronteras BFS se expanden simultáneamente — una desde el inicio, otra desde la meta.
Cuando se encuentran, el camino se ensambla desde ambas mitades. En grillas abiertas
la frontera combinada es aproximadamente b^(d/2) nodos, frente a b^d del BFS unidireccional.
Observá las dos fronteras coloreadas cerrarse la una hacia la otra.`,
			props: [
				{ label: "Óptimo", value: "Sí — menos saltos", colour: "green" },
				{ label: "Completo", value: "Sí", colour: "green" },
				{ label: "Pesos", value: "Ignorados", colour: "orange" },
				{ label: "Heurística", value: "Ninguna", colour: "orange" },
			],
			games: [
				{
					title: "Grafos de redes viales",
					body: "Los sistemas de navegación GPS usan Dijkstra bidireccional (la variante con pesos) para planificar rutas en redes viales con millones de nodos.",
				},
			],
		},
		idastar: {
			title: "IDA* (A* con Profundización Iterativa)",
			body: `IDA* realiza búsquedas en profundidad acotadas por un umbral de costo que comienza en h(inicio)
y se incrementa en cada iteración al menor valor f que superó el umbral anterior.
El uso de memoria es O(d) — solo se almacena el camino actual — ideal para espacios de búsqueda
muy grandes donde la lista abierta de A* sería enorme.`,
			props: [
				{ label: "Óptimo", value: "Sí — con h admisible", colour: "green" },
				{ label: "Completo", value: "Sí", colour: "green" },
				{ label: "Pesos", value: "Respetados", colour: "green" },
				{ label: "Heurística", value: "h(n), igual que A*", colour: "blue" },
				{ label: "Memoria", value: "O(d) — muy baja", colour: "purple" },
			],
			games: [
				{
					title: "Resolutores de puzzles",
					body: "IDA* fue el primer algoritmo en resolver el puzzle de 15 piezas de manera óptima en tiempo real. Se usa en IA de juegos combinatorios donde el espacio de estados es enorme.",
				},
			],
		},
	},

	glossaryTitle: "Glosario",
	glossaryClose: "Cerrar glosario",
	glossary: [
		{
			term: "Conjunto abierto (frontera)",
			def: "El conjunto de nodos descubiertos que aún no han sido explorados completamente. BFS usa una cola; Dijkstra y A* usan una cola de prioridad.",
		},
		{
			term: "Conjunto cerrado (visitado)",
			def: "Nodos que han sido procesados completamente y cuyo costo óptimo se conoce. Nunca se re-expanden.",
		},
		{
			term: "g(n)",
			def: "El costo exacto del camino más económico conocido desde el nodo inicial hasta n.",
		},
		{
			term: "h(n)",
			def: "La estimación heurística del costo desde n hasta la meta. Debe ser admisible (nunca sobreestimar) para que A* sea óptimo.",
		},
		{
			term: "f(n) = g(n) + h(n)",
			def: "La clave de prioridad de A*. Los nodos con menor f se expanden primero.",
		},
		{
			term: "Heurística admisible",
			def: "Una heurística que nunca sobreestima el costo real hasta la meta. La distancia Manhattan es admisible para grillas de 4 direcciones con costo unitario.",
		},
		{
			term: "Óptimo",
			def: "Un algoritmo es óptimo si siempre encuentra el camino de menor costo cuando existe uno.",
		},
		{
			term: "Completo",
			def: "Un algoritmo es completo si siempre encuentra un camino cuando existe uno.",
		},
		{
			term: "Peso de celda",
			def: "Un multiplicador de costo de movimiento aplicado al entrar en una celda. Los algoritmos sin pesos (BFS, DFS, Voraz) tratan todas las celdas transitables con costo 1.",
		},
		{
			term: "Movimiento diagonal",
			def: "Cuando está habilitado, los agentes pueden moverse en 8 direcciones. Los pasos diagonales cuestan √2 ≈ 1.414 × el peso de la celda. Las heurísticas Octil y Chebyshev son exactas para este caso.",
		},
		{
			term: "NavMesh",
			def: "Una malla de navegación — un grafo de transitabilidad del nivel usado por los motores de juego. A* típicamente corre sobre las aristas del NavMesh en lugar de una grilla cruda.",
		},
	],

	attribution: "Hecho con ❤️ para Swinburne — IA para Juegos — Por E. Ketterer",
	footerMadeWith: "Hecho con ❤️ para Swinburne",
	footerSubject: "IA para Juegos",
	version: "v",
	source: "Fuente",
};
