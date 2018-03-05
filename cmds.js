//Incluye  el model.js
const model = require('./model');

//Incluye las funcioones para dar color al texto
const {log, biglog, errorlog, colorize} = require("./out");

//Mostrar la ayuda
exports.helpCmd = rl => {
      log("Comandos:");
      log(" h|help - Muestra esta ayuda.");
      log(" list - Listar los quizzes existentes.");
      log(" show <id> - Muestra la pregunta y la respuesta del quiz indicado.");
      log(" add - Añadir un nuevo quiz interactivamente.");
      log(" delete <id> - Borrar el quiz indicado.");
      log(" edit <id> - Editar el quiz indicado.");
      log(" test <id> - Probar el quiz indicado.");
      log(" p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
      log(" credits - Créditos.");
      log(" q|quit - Salir del programa");
      rl.prompt();
};


exports.listCmd = rl =>{
	model.getAll().forEach((quiz, id) => {
		log(` [${colorize(id, 'magenta')}]: ${quiz.question} `);
	});
  	rl.prompt();
};


exports.showCmd = (rl, id) => {
	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
	}
	else{
		try{
			const quiz = model.getByIndex(id);
			log(` [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
		} 
		catch(error){
			errorlog(error.message);
		}
	}
  	rl.prompt();
};


exports.addCmd = rl =>{
	rl.question(colorize(' Introduzca una pregunta: ', 'red'), question =>{
		rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer =>{
			model.add(question, answer);
			log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
			rl.prompt();
		});
	});
};


exports.deleteCmd = (rl, id) =>{
  if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
	}
	else{
		try{
			model.deleteByIndex(id);
		}catch(error){
			errorlog(error.message);
		}
	}
  rl.prompt();
};

exports.editCmd = (rl, id) =>{
	if(typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`);
		rl.prompt();
	}
	else{
		try{
			const quiz = model.getByIndex(id);
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
			rl.question(colorize(' Introduzca una pregunta: ', 'red'), question =>{
				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
				rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer =>{
					model.update(id, question, answer);
					log(` Se ha cambiado  el quiz ${colorize( id , 'magenta')} por: ${question} ${colorize('=>','magenta')} ${answer}`);
					rl.prompt();
				});
			});
		}catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}

};

exports.testCmd = (rl, id) =>{
	if(typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`);
		rl.prompt();
	}
	else{
		try{
			//const quiz = exports.showCmd(rl,id); 
			const quiz = (model.getByIndex(id)).question + "?: ";
			
			//rl.question(colorize( quiz , 'red'), answer =>{
			//		rl.prompt();
			//});
			rl.question(colorize(quiz, 'red'),respuesta=>{
				if(respuesta.trim().toLowerCase() === model.getByIndex(id).answer.toLowerCase()){
					log(`Su respuesta es: `);
					biglog('Correcta', 'green');
					rl.prompt();
				}
				else{
					log(`Su respuesta es: `);
					biglog('Incorrecta', 'red');
					rl.prompt();
				}
			});
			

		}catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}


};

exports.playCmd = rl =>{
	let score = 0; //preguntas que se han ido acertando
	let preguntasQuedan = [];
	let copy = []
	copy = model.getAll();
	for(x=0; x < model.count(); x++){
		preguntasQuedan[x] =  x;
	}


	const playOne = () =>{
		if( preguntasQuedan.length === 0){
			log(`No hay nada más que preguntar.`);
			log(`Fin del examen. Aciertos: `)
			biglog( score , 'magenta');
			rl.prompt();
		}

	
		else{
			try{
			let id = Math.floor(Math.random()*model.count());
			if(id > copy.length-1){playOne();}
			preguntasQuedan.splice(id,1);
			//let quiz = (model.getByIndex(id)).question + "?: ";
			let quiz = copy[id].question + "?: ";
				rl.question(colorize(quiz, 'red'),respuesta=>{
					if(respuesta.trim().toLowerCase() === copy[id].answer.toLowerCase()){
						score = score + 1;
						copy.splice(id,1);
						log(`CORRECTO - Lleva ` + score + ` aciertos.`);
						playOne();
					}
					else{
						log(`INCORRECTO.`);
						log(`Fin del examen. Aciertos: `);
						biglog( score , 'magenta');
						rl.prompt();
					}
				});
			

			}
			catch(error){}
		}
	};

	playOne();

};

	


exports.creditsCmd = rl =>{
  log('JUAN', 'green');
  rl.prompt();
  };

exports.quitCmd = rl =>{
  rl.close();
  rl.prompt();
};
