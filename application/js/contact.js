const btn = document.getElementById('btn')
const inputEmail = document.getElementById('inputEmail')
const inputName = document.getElementById('inputName')


const emailSubmission = (email, name) => {
  if (name == ""){
    alert(`Please enter your name!`)
  }
  if (email == ""){
    alert(`Please enter an email address!`)
  }
  if (email.includes('@') == false){
    alert(`Please enter a valid email address!`)
  }
  else {
    alert(`Thank you ${name}, we will send an email to "${email}" soon!`)
  }
}


btn.addEventListener('click', (event) => {emailSubmission(inputEmail.value, inputName.value)})

