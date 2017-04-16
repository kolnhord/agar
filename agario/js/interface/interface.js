function Interface(startGameCallback) {

	function loginAndStartGame() {
		var nick = document.getElementById("inputLogin").value;
		var pass = document.getElementById("inputPassword").value;
		if (nick && pass) {
			$.get({
				url: "./api", // куда шлем запрос
				dataType: "json", // в каком формате ожидаем ответ
				data: { // параметры запроса
					method: 'auth',
					nick: nick,
					pass: pass
				},
				success: function(result) { // функция с ответом сервера
					if (result && result.result === 'ok' && result.data) {
						deinit();
						startGameCallback();
					} else {
						alert('Ошибка авторизации! Что-то пошло не так, увы! :(');
					}
				}
			});
		}
	}

	function setEventListeners() {
		var button = document.getElementById("enterToGame");
		button.addEventListener("click", loginAndStartGame);
	}

	function deinit() {
		document.getElementById("enterToGame").removeEventListener("click", loginAndStartGame);
		document.querySelector('body').innerHTML = "";
	}
	
	function init() {
		var str = '<div>' + 
					'<span>Логин</span><br>' + 
					'<input id="inputLogin" type="text" /><br>' + 
					'<span>Пароль</span><br>' + 
					'<input id="inputPassword" type="password" /><br>' + 
					'<input id="enterToGame" type="button" value="Войти" />' + 
				  '</div>';
		document.querySelector('body').innerHTML = str;
		setEventListeners();
	}
	init();
}