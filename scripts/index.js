const URL="http://localhost:8080"

var loginBlock = document.getElementById("login");
var registerBlock = document.getElementById("register");
var z = document.getElementById("btn");

function register() {
    loginBlock.style.left = "-200px";
    registerBlock.style.left = "190px";
    z.style.left = "110px";
    document.getElementById("title").innerText="Signup Form"
}

function login() {
    loginBlock.style.left = "190px";
    registerBlock.style.left = "-500px";
    z.style.left = "0";
    document.getElementById("title").innerText="Login Form"

}

registerBlock.addEventListener("submit",(e)=>{
    e.preventDefault()
    const email=registerBlock.email.value
    const password=registerBlock.password.value
    const confirm=registerBlock.cpassword.value

    if(confirm!=password){
        alert("Confirm Password does not match with Password")
        return
    }

    fetch(`${URL}/user/signup`,{
        method:"POST",
        headers: {
            "Content-type": "application/json"
        },
        body:JSON.stringify({email,password})
    })
    .then(async(res)=>{
        try {
            let data=await res.json()
        return {data,status:res.status}
        } catch (error) {
            console.log(error)
            alert(error)
        }
        
    })
    .then((res)=>{
        if(res.status==201){
            alert(res.data.msg)
            login()
        }else{
            alert(res.data.msg)
        }
    })

})



loginBlock.addEventListener("submit",(e)=>{
    e.preventDefault()
    const email=loginBlock.email.value
    const password=loginBlock.password.value

    fetch(`${URL}/user/login`,{
        method:"POST",
        headers: {
            "Content-type": "application/json"
        },
        body:JSON.stringify({email,password})
    })
    .then(async(res)=>{
        try {
            let data=await res.json()
        return {data,status:res.status}
        } catch (error) {
            console.log(error)
            alert(error)
        }
        
    })
    .then((res)=>{
        if(res.status==201){
            localStorage.setItem("token",JSON.stringify(res.data.token))
            alert(res.data.msg)
            window.location.href="./html/dashboard.html"
        }else{
            alert(res.data.msg)
        }
    })

})
