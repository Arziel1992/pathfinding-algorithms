/**
 * @file es.js — Español latinoamericano neutro (tuteo).
 * Cada texto visible para el estudiante está aquí, con las mismas claves que
 * en.js. No se traducen: E. Ketterer, códigos de unidad, la versión y la
 * notación matemática.
 */

export default {
	title: "Algoritmos de búsqueda de caminos",
	tagline:
		"Observa cómo siete algoritmos exploran la misma cuadrícula, y predice la ruta antes.",
	description:
		"Visualizador interactivo de BFS, DFS, Dijkstra, A*, búsqueda voraz, BFS bidireccional e IDA* sobre una cuadrícula con pesos: dibuja la ruta que esperas, ejecuta una búsqueda y compara el costo de cada algoritmo en metros.",
	skipToMain: "Ir a la cuadrícula",
	toolbarLabel: "Ajustes de la herramienta",
	manualButton: "Manual",
	languageLabel: "Idioma",
	themeToggle: "Tema oscuro",
	toggleSidebarLeft: "Mostrar u ocultar el panel de teoría",
	toggleSidebarRight: "Mostrar u ocultar el panel de controles",
	openGlossary: "Abrir el manual en este tema",

	algoNames: {
		bfs: "Búsqueda en anchura (BFS)",
		dfs: "Búsqueda en profundidad (DFS)",
		dijkstra: "Algoritmo de Dijkstra",
		astar: "A* (A estrella)",
		greedy: "Búsqueda voraz primero el mejor",
		bibfs: "BFS bidireccional",
		idastar: "IDA* (A* con profundización iterativa)",
	},

	heuristicNames: {
		manhattan: "Manhattan",
		euclidean: "Euclidiana",
		chebyshev: "Chebyshev",
		octile: "Octil",
	},
	heuristicWarning:
		"Manhattan sobreestima cuando se permiten movimientos diagonales: cuenta un paso diagonal de √2 m como 2 m. A* puede entonces perder la ruta más barata. Prueba Octil.",

	controls: "Controles",
	algorithm: "Algoritmo",
	heuristic: "Heurística",
	options: "Opciones",
	speed: "Velocidad",
	speedValue: "{ms} ms por paso",
	diagonal: "Permitir movimiento diagonal",
	showCosts: "Mostrar costos de las aristas",
	showCostsHint:
		"Esquina: el costo de moverse a esa celda. Centro: g, el costo más barato encontrado hasta ahora desde S, en metros (Dijkstra, A*, IDA*).",
	cellG: "g = {g} m",
	drawMode: "Modo de dibujo",
	modes: {
		predict: "Predecir ruta",
		wall: "Muro",
		weight: "Barro (peso)",
		erase: "Borrar",
		start: "Mover inicio",
		end: "Mover meta",
	},
	weightLevel: "Peso del barro",
	weightHint:
		"Entrar a una celda de barro cuesta su peso por la longitud del paso.",
	maze: "Generar una cuadrícula",
	mazeDemo: "Escena de ejemplo",
	mazeRandom: "Muros al azar",
	mazeRecursive: "Laberinto",
	mazeCosts: "Costos al azar",
	actions: "Ejecutar",
	play: "Ejecutar",
	pause: "Pausar",
	step: "Paso",
	stop: "Detener",
	clearPath: "Borrar búsqueda",
	clearAll: "Vaciar cuadrícula",

	predictTitle: "Tu predicción",
	predictHint:
		"Elige Predecir ruta, traza desde S hasta E y luego presiona Ejecutar. La ejecución evalúa tu ruta.",
	predictDrawn: "Ruta trazada: {n} celdas. Presiona Ejecutar para comprobarla.",
	predictClear: "Borrar predicción",
	predictReasons: {
		empty: "Tu ruta está vacía: comiénzala en S.",
		start: "Tu ruta debe comenzar en S.",
		end: "Tu ruta se detiene antes de E (fila {r}, columna {c}).",
		wall: "Tu ruta atraviesa un muro en la fila {r}, columna {c}.",
		gap: "Tu ruta salta una celda en la fila {r}, columna {c}.",
	},
	predictCost: "Tu ruta cuesta {cost} m.",
	predictOptimal: "Es la ruta más barata posible.",
	predictAbove:
		"La ruta más barata cuesta {best} m: la tuya es {pct} % más cara.",
	predictOverlap:
		"El {pct} % de tu ruta coincide con el camino que encontró este algoritmo.",

	telemetry: "Métricas de la ejecución",
	status: "Estado",
	statuses: {
		idle: "Listo: traza una predicción y presiona Ejecutar",
		running: "Ejecutando…",
		paused: "En pausa",
		done: "Camino encontrado",
		noPath: "No existe un camino",
		gaveUp: "Se rindió tras {n} expansiones: no prueba que no exista un camino",
	},
	expanded: "Nodos expandidos",
	frontier: "Tamaño de la frontera",
	pathCost: "Costo del camino",
	pathSteps: "Pasos del camino",
	bestCost: "Lo más barato posible",
	optimalYes: "óptimo",
	optimalNo: "{pct} % más",
	threshold: "Cota de costo de IDA*",
	metres: "m",
	scale: "Escala: 1 celda = {m} m. Los pasos diagonales cuestan √2 × el peso.",

	compareAll: "Comparar todos los algoritmos",
	compareTitle: "Misma cuadrícula, todos los algoritmos",
	compareCaption: "Costo en metros; el más barato es {best} m.",
	colAlgo: "Algoritmo",
	colExpanded: "Expandidos",
	colCost: "Costo (m)",
	colOptimal: "¿El más barato?",
	yes: "Sí",
	no: "No",
	none: "ninguno",
	gaveUp: "se rindió",

	legend: "Leyenda",
	legendStart: "Inicio (S)",
	legendEnd: "Meta (E)",
	legendWall: "Muro",
	legendWeight: "Barro: el número es su peso",
	legendOpen: "Frontera (conjunto abierto), con un punto",
	legendClosed: "Expandido (conjunto cerrado)",
	legendPath: "Camino encontrado (línea continua)",
	legendPredicted: "Tu ruta predicha (línea discontinua)",
	legendBwdOpen: "Frontera inversa (bidireccional)",
	legendBwdClosed: "Expandido inverso (bidireccional)",

	canvasLabel:
		"Cuadrícula de búsqueda, {rows} filas por {cols} columnas. Las flechas mueven el cursor; Enter aplica el modo de dibujo.",
	cursorAt: "Fila {r}, columna {c}: {what}",
	cellKinds: {
		empty: "terreno libre",
		wall: "muro",
		weight: "barro, peso {w}",
		start: "inicio",
		end: "meta",
	},
	kbHint:
		"Arrastra para dibujar · arrastre derecho borra · en la cuadrícula: flechas + Enter · Espacio ejecuta/pausa · S avanza un paso",

	theory: "Teoría",
	inGames: "En videojuegos",
	complexityLabel: "Complejidad en tiempo y espacio",
	complexity: {
		bfs: {
			formula: "T: O(V + E)   S: O(V)",
			items: [
				"V — celdas de la cuadrícula",
				"E — movimientos entre celdas vecinas",
			],
		},
		dfs: {
			formula: "T: O(V + E)   S: O(V)",
			items: [
				"V — celdas de la cuadrícula",
				"E — movimientos entre celdas vecinas",
			],
		},
		dijkstra: {
			formula: "T: O((V + E) log V)   S: O(V)",
			items: [
				"V — celdas",
				"log V — la cola de prioridad con montículo binario",
			],
		},
		astar: {
			formula: "T: O((V + E) log V)   S: O(V)",
			items: [
				"El peor caso es el de Dijkstra; una buena heurística expande muchas menos celdas",
				"log V — la cola de prioridad con montículo binario",
			],
		},
		greedy: {
			formula: "T: O((V + E) log V)   S: O(V)",
			items: ["V — celdas", "log V — la cola de prioridad ordenada solo por h"],
		},
		bibfs: {
			formula: "T: O(b^(d/2))   S: O(b^(d/2))",
			items: [
				"b — factor de ramificación (aquí 4 u 8)",
				"d/2 — cada frontera solo busca la mitad de la profundidad",
			],
		},
		idastar: {
			formula: "T: O(b^d)   S: O(d)",
			items: [
				"b — factor de ramificación; d — profundidad del camino más barato",
				"S: O(d) — solo se guarda el camino actual, así que cada pasada vuelve a expandir celdas",
			],
		},
	},
	heuristicGuideTitle: "Cómo elegir una heurística",
	heuristicGuide: [
		{
			name: "Manhattan — |Δr| + |Δc|",
			body: "La distancia real en una cuadrícula vacía de 4 direcciones. Con diagonales sobreestima, así que ahí no es admisible.",
		},
		{
			name: "Octil",
			body: "La distancia real en una cuadrícula vacía de 8 direcciones donde una diagonal cuesta √2. La mejor opción con diagonales.",
		},
		{
			name: "Chebyshev — max(|Δr|, |Δc|)",
			body: "Exacta solo si una diagonal costara 1. Aquí cuesta √2, así que Chebyshev subestima: sigue siendo admisible, pero A* expande más.",
		},
		{
			name: "Euclidiana — √(Δr² + Δc²)",
			body: "La distancia en línea recta. Siempre admisible en esta cuadrícula, nunca más ajustada que Octil.",
		},
	],
	algoInfo: {
		bfs: {
			title: "Búsqueda en anchura (BFS)",
			body: "BFS expande todas las celdas a un paso, luego todas las que están a dos pasos, y así sucesivamente, con una cola FIFO (primero en entrar, primero en salir). Encuentra la ruta con menos pasos, que es la más barata solo cuando todos los pasos cuestan lo mismo. Agrega barro o permite diagonales y compara su costo con el de Dijkstra.",
			props: [
				{
					label: "Ruta más barata",
					value: "Solo si todos los pasos cuestan lo mismo",
					colour: "orange",
				},
				{ label: "Completo", value: "Sí", colour: "green" },
				{ label: "Pesos", value: "Ignorados", colour: "orange" },
				{ label: "Heurística", value: "Ninguna", colour: "orange" },
			],
			games: [
				{
					title: "Alcance de movimiento",
					body: "Los juegos tácticos por turnos muestran qué casillas alcanza una unidad en N movimientos: un BFS desde la unidad, detenido en la profundidad N.",
				},
				{
					title: "Relleno por inundación",
					body: "El balde de pintura y las comprobaciones de «¿qué salas están conectadas?» son un BFS sobre celdas vecinas.",
				},
			],
		},
		dfs: {
			title: "Búsqueda en profundidad (DFS)",
			body: "DFS sigue una rama tan lejos como puede antes de retroceder, con una pila LIFO (último en entrar, primero en salir). La ruta que devuelve depende del orden en que prueba los vecinos y rara vez es la más corta. Su fortaleza es recorrer todo lo alcanzable con muy poca contabilidad.",
			props: [
				{ label: "Ruta más barata", value: "No", colour: "red" },
				{
					label: "Completo",
					value: "Sí, en una cuadrícula finita",
					colour: "green",
				},
				{ label: "Pesos", value: "Ignorados", colour: "orange" },
				{ label: "Heurística", value: "Ninguna", colour: "orange" },
			],
			games: [
				{
					title: "Generación de laberintos",
					body: "El retroceso recursivo —DFS con los vecinos en orden aleatorio— talla los laberintos del botón Laberinto.",
				},
				{
					title: "Regiones conectadas",
					body: "Etiquetar qué zonas de un nivel están conectadas permite a una IA evitar buscar hacia una región a la que nunca podrá llegar.",
				},
			],
		},
		dijkstra: {
			title: "Algoritmo de Dijkstra",
			body: "Dijkstra siempre expande la celda de la frontera con el menor costo acumulado, g. A diferencia de BFS, considera el costo, así que rodea el barro cuando eso es más barato. Es A* con h = 0: se expande por igual en todas direcciones hasta llegar a la meta.",
			props: [
				{ label: "Ruta más barata", value: "Sí", colour: "green" },
				{
					label: "Completo",
					value: "Sí, con pesos no negativos",
					colour: "green",
				},
				{ label: "Pesos", value: "Respetados", colour: "green" },
				{ label: "Heurística", value: "Ninguna (h = 0)", colour: "orange" },
			],
			games: [
				{
					title: "Costos de terreno",
					body: "Los juegos de estrategia asignan un costo de movimiento al terreno (bosque 2, camino 1). Dijkstra devuelve la ruta más barata, no la más corta.",
				},
				{
					title: "Mapas de distancia",
					body: "Una sola ejecución de Dijkstra desde un punto da el costo hasta cada celda. En los roguelikes se les llama «mapas de Dijkstra» y sirven para guiar a muchos monstruos a la vez.",
				},
			],
		},
		astar: {
			title: "Algoritmo A*",
			body: "A* expande la celda de la frontera con el menor f = g + h: el costo pagado hasta ahora más una estimación heurística de lo que falta. Con una heurística admisible (que nunca sobreestima) sigue encontrando la ruta más barata, pero expande muchas menos celdas que Dijkstra.",
			props: [
				{
					label: "Ruta más barata",
					value: "Sí, con una h admisible",
					colour: "green",
				},
				{ label: "Completo", value: "Sí", colour: "green" },
				{ label: "Pesos", value: "Respetados", colour: "green" },
				{ label: "Heurística", value: "g + h", colour: "blue" },
			],
			games: [
				{
					title: "Mallas de navegación",
					body: "Los motores de juego planifican las rutas de los agentes con A* sobre una malla de navegación, un grafo de polígonos transitables, en lugar de una cuadrícula de celdas.",
				},
				{
					title: "Cuadrículas de casillas",
					body: "En cuadrículas de 8 direcciones, Octil es la heurística habitual, porque es la distancia exacta cuando no hay obstáculos.",
				},
			],
		},
		greedy: {
			title: "Búsqueda voraz primero el mejor",
			body: "La búsqueda voraz expande la celda que parece más cercana a la meta, usando solo h e ignorando el costo pagado. Es rápida en espacios abiertos, pero un muro entre ella y la meta puede llevarla a un callejón sin salida, y su ruta puede estar lejos de la más barata. Compara sus expansiones y su costo con los de A*.",
			props: [
				{ label: "Ruta más barata", value: "No", colour: "red" },
				{
					label: "Completo",
					value: "Sí en una cuadrícula finita, tal como está implementada",
					colour: "green",
				},
				{ label: "Pesos", value: "Ignorados", colour: "orange" },
				{ label: "Heurística", value: "Solo h", colour: "blue" },
			],
			games: [
				{
					title: "Rutas suficientemente buenas",
					body: "Cuando importa más una ruta plausible que la más barata, una búsqueda voraz termina antes y expande menos celdas.",
				},
			],
		},
		bibfs: {
			title: "BFS bidireccional",
			body: "Dos búsquedas en anchura corren a la vez, una desde el inicio y otra desde la meta, nivel por nivel. Cuando se tocan, la ruta se une con ambas mitades. En una cuadrícula abierta cada frontera solo necesita la mitad de la profundidad, así que se expanden muchas menos celdas. Igual que BFS, cuenta pasos, no costo.",
			props: [
				{
					label: "Ruta más barata",
					value: "Solo si todos los pasos cuestan lo mismo",
					colour: "orange",
				},
				{ label: "Completo", value: "Sí", colour: "green" },
				{ label: "Pesos", value: "Ignorados", colour: "orange" },
				{ label: "Heurística", value: "Ninguna", colour: "orange" },
			],
			games: [
				{
					title: "Planificación de rutas",
					body: "Los planificadores sobre grandes redes viales buscan desde ambos extremos a la vez —la versión con pesos es Dijkstra bidireccional— para reducir el área explorada.",
				},
			],
		},
		idastar: {
			title: "IDA* (A* con profundización iterativa)",
			body: "IDA* hace pasadas en profundidad que se detienen donde f = g + h supera una cota. La primera cota es h(inicio); cada pasada la sube al menor f que la superó. Solo guarda el camino actual, así que usa muy poca memoria, pero cada pasada vuelve a expandir las celdas anteriores, y por eso el conteo crece tan rápido aquí.",
			props: [
				{
					label: "Ruta más barata",
					value: "Sí, con una h admisible",
					colour: "green",
				},
				{
					label: "Completo",
					value:
						"Sí, con tiempo; esta herramienta se detiene a las 50 000 expansiones",
					colour: "orange",
				},
				{ label: "Pesos", value: "Respetados", colour: "green" },
				{
					label: "Memoria",
					value: "O(d): solo el camino actual",
					colour: "purple",
				},
			],
			games: [
				{
					title: "Resolución de puzles",
					body: "Korf (1985) presentó IDA* y lo usó para encontrar soluciones óptimas a instancias aleatorias del 15-puzle, donde la lista abierta de A* no cabría en memoria.",
				},
			],
		},
	},

	glossaryTitle: "Manual y glosario",
	glossaryClose: "Cerrar",
	glossaryFooter:
		"Todos los costos de esta herramienta están en metros; una celda mide 1 m.",
	glossGroups: {
		use: "Uso de la herramienta",
		search: "Búsqueda",
		cost: "Costo",
	},
	gloss: {
		manual: {
			title: "Cómo usar esta herramienta",
			body: "Elige un algoritmo a la derecha. Traza la ruta que esperas de S a E con Predecir ruta y luego presiona Ejecutar o Paso: la cuadrícula muestra qué celdas expande la búsqueda y el panel bajo la cuadrícula evalúa tu ruta.\nEdita la cuadrícula con muros y barro, mueve S y E o genera una escena, y presiona Comparar todos los algoritmos para ver cada búsqueda sobre la misma cuadrícula.",
		},
		keys: {
			title: "Teclado y ratón",
			body: "Arrastra sobre la cuadrícula para dibujar con el modo actual; el arrastre con el botón derecho borra.\nCon la cuadrícula enfocada, las flechas mueven un cursor y Enter dibuja en él; se lee en voz alta la celda del cursor. Espacio ejecuta o pausa, S avanza una expansión y R borra la búsqueda.",
		},
		predict: {
			title: "Predecir una ruta",
			body: "Predecir ruta dibuja tu suposición como una línea discontinua desde S. Cuando la búsqueda termina, la herramienta comprueba que tu ruta sea válida —empieza en S, termina en E, nunca salta una celda ni cruza un muro—, compara su costo con el más barato posible e indica cuánto de ella comparte el camino del algoritmo.",
		},
		compare: {
			title: "Comparar algoritmos",
			body: "Comparar todos los algoritmos ejecuta cada búsqueda sobre la cuadrícula tal como está, sin animación. Muestra las celdas que expandió cada una, el costo de la ruta que encontró y si esa ruta es la más barata, comprobado contra Dijkstra, que siempre es óptimo con costos no negativos.",
		},
		costs: {
			title: "Costos de las aristas",
			body: "El costo de un movimiento es el peso de la celda a la que entra, por 1 en un paso recto o por √2 en uno diagonal. Mostrar costos de las aristas escribe ese peso en la esquina de cada celda y, cuando Dijkstra, A* o IDA* alcanzan una celda, su valor g en el centro.\nCostos al azar da a cada celda libre un peso de 1 a 9. Con cada movimiento a un precio distinto, la ruta con menos pasos (BFS) y la más barata (Dijkstra, A*) dejan de coincidir.",
		},
		open: {
			title: "Conjunto abierto (frontera)",
			body: "Celdas descubiertas que aún no se han expandido, dibujadas con un punto. BFS las guarda en una cola; Dijkstra y A*, en una cola de prioridad.",
		},
		closed: {
			title: "Conjunto cerrado (expandido)",
			body: "Celdas ya expandidas. Con una heurística consistente, Dijkstra y A* nunca necesitan expandir una de nuevo.",
		},
		g: {
			title: "g(n)",
			body: "El costo en metros de la ruta más barata encontrada hasta ahora desde el inicio hasta n. Puede bajar mientras n espera en la frontera, si se encuentra una entrada más barata.",
		},
		h: {
			title: "h(n)",
			body: "Una estimación heurística, en metros, del costo desde n hasta la meta.",
		},
		f: {
			title: "f(n) = g(n) + h(n)",
			body: "La prioridad de A*: se expande primero la celda con el menor f.",
		},
		admissible: {
			title: "Heurística admisible",
			body: "Una que nunca sobreestima el costo real restante. A* con una h admisible siempre devuelve la ruta más barata.",
		},
		optimal: {
			title: "Más barata (óptima)",
			body: "Una ruta es óptima cuando ninguna otra de S a E cuesta menos.",
		},
		complete: {
			title: "Completo",
			body: "Un algoritmo es completo si siempre encuentra una ruta cuando existe una.",
		},
		mud: {
			title: "Barro (peso de celda)",
			body: "Un multiplicador del costo de entrar a una celda. BFS, DFS, la búsqueda voraz y BFS bidireccional lo ignoran.",
		},
		metre: {
			title: "Metro",
			body: "La unidad de costo de esta herramienta: una celda mide 1 m, así que un paso recto en terreno libre cuesta 1 m y uno diagonal √2 ≈ 1,414 m.",
		},
	},

	footerMadeWith: "Hecho con ❤️ para Swinburne",
	footerSubject: "Búsqueda de caminos",
	versionTitle: "Versión: la fecha y hora de esta publicación",
};
