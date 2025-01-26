const send = require('./m06-03/m06-03');

async function main() {
    
    let message = 'Hello World!';
  
    try {
      await send(message);
      console.log('Функция send успешно выполнена');
    } catch (error) {
      console.error('Произошла ошибка при выполнении функции send:', error);
    }
}
  
main();