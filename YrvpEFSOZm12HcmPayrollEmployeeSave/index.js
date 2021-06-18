
/**
 * Nome da primitiva : employeeSave
 * Nome do dominio : hcm
 * Nome do serviço : payroll
 * Nome do tenant : trn26089248
 **/
 
 const axios = require("axios");

exports.handler = async (event) => {
  
  let body = parseBody(event);
  let tokenSeniorX = event.headers['X-Senior-Token'];
  
  
 const instance = axios.create ({
   baseURL: 'http://platform-homologx.senior.com.br/t/senior.com.br/bridge/1.0/rest/',
   headers: {
     'Authorization': tokenSeniorX
   }
});
   
  if(body.sheetPersona.nickname.length > 10){
    return sendRes(400, 'O apelido deve ter no maximo 10 caracteres!');
  }
  //Não permitir alterar o CPF do colaborador
  if (body.sheetInitial.employee){
    let employee = await instance.get(`/hcm/payroll/entities/employee/${body.sheetInitial.employee.tableId}`);
    
    if (employee.data.person.cpf !== body.sheetDocument.cpfNumber){
      return sendRes(400, 'Não é permitido alterar p CPF do colaborador!');
    }
  }
  
  //caso todas as validações passem
  return sendRes(200, JSON.parse(event.body));
};

const parseBody = (event) => {
  return typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {};
};

const sendRes = (status,body) => {
  var response = {
    statusCode:status,
    headers: {
      "Content-Type":"application/json"
    },
    body:typeof body ==='string' ? body : JSON.stringify(body)
  };
  return response;
};
