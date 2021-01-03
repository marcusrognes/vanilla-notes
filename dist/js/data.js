var db = new Promise((resolve, reject) => {
	const request = window.indexedDB.open('VanillaNotes', 1);

	request.onerror = function (event) {
		reject(event);
		console.error(event);
	};

	request.onsuccess = function (event) {
		resolve(request.result);
	};

	request.onupgradeneeded = function (event) {
		const db = event.target.result;
		db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
	};
});

const Todos = {
	insert: todo => {
		return new Promise(async (resolve, reject) => {
			const request = (await db)
				.transaction('todos', 'readwrite')
				.objectStore('todos')
				.add(todo);

			request.onsuccess = function (event) {
				resolve({ id: event.target.result, ...todo });
			};

			request.onerror = function (event) {
				console.error(event);
				reject(event);
			};
		});
	},
	getAll: () => {
		return new Promise(async (resolve, reject) => {
			var objectStore = (await db)
				.transaction('todos')
				.objectStore('todos');

			let data = [];

			objectStore.openCursor().onsuccess = function (event) {
				var cursor = event.target.result;

				if (cursor) {
					data.push(cursor.value);
					cursor.continue();
				} else {
					resolve(data);
				}
			};
		});
	},
	remove: id => {
		return new Promise(async (resolve, reject) => {
			const request = (await db)
				.transaction('todos', 'readwrite')
				.objectStore('todos')
				.delete(id);

			request.onsuccess = function (event) {
				resolve(event);
			};

			request.onerror = function (event) {
				console.error(event);
				reject(event);
			};
		});
	},
};
