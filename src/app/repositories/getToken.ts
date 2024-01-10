export function getToken(){
    try{
        return localStorage.getItem('token')
    }
    catch(erro){
        return undefined
    }
  }