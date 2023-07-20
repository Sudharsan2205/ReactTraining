import axios, { AxiosError, HttpStatusCode } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { MarkEmailRead, Send, VpnKey ,Close} from '@mui/icons-material';
import { AlertTitle, Alert,IconButton } from '@mui/material';
import "./Login.css"



function Login() {
	let navigate = useNavigate();
	let [LoginDetails, SetLoginDetails] = useState({ Email: "", Password: "" });
	let [TextorPassword, SetTextorPassword] = useState(true)
	let [Erroralert, SetErroralert] = useState(false)
	const secretPass = "aSA12982qHSdaa";
	let Validate = (event) => {
		const { name, value } = event.target;
		SetLoginDetails({ ...LoginDetails, [name]: value })
	}
	let SubmitMethod = (evt) => {
		evt.preventDefault();
		axios.post("http://localhost:2000/FindUser", LoginDetails).then((UserRes) => {
			console.log(UserRes)
			UserRes.data.Status == "Ok" ?
				axios.post("http://localhost:2000/FindPassword", LoginDetails).then((validated) => {
					let encryptedId = encryptData(validated.data.id);
					validated.data.Status == "S" ? RedirectTodash(encryptedId, validated.data.Role) :
						alert("Password doesn't exists")
				})
				:
				alert("Email is not matched");
		}).catch((error) => {
			SetErroralert(!Erroralert)
		})

	}
	const encryptData = (id) => {
		let data = CryptoJS.AES.encrypt(id, secretPass).toString();
		data = data.replaceAll('/', "%2F")
		return data
	}
	function RedirectTodash(eId, Role) {
		console.log(eId, Role);
		navigate(`/${Role}/${eId}`)
	}
	return <>
		{Erroralert &&
			<Alert severity="error"  action={
				<IconButton
				  aria-label="close"
				  color="inherit"
				  size="small"
				  onClick={() => {
					SetErroralert(!Erroralert);
				  }}
				>
				  <Close fontSize="inherit" />
				</IconButton>
			  }>
				<AlertTitle>Error</AlertTitle>
				Internal server error— <strong>check it out!</strong>
			</Alert>
		}<div className="container">
			<div className="screen">
				<div className="screen__content">
					<form className="login" onSubmit={SubmitMethod}>
						<div className="login__field">
							<MarkEmailRead />
							<input type="text" className="login__input" onInput={(e) => { e.target.value = e.target.value.toLowerCase() }} onChange={Validate} name="Email" placeholder="Email" />
						</div>
						<div className="login__field">
							<span onClick={() => SetTextorPassword(!TextorPassword)}><VpnKey /></span>
							<input type={TextorPassword ? "password" : "text"} className="login__input" onChange={Validate} name="Password" placeholder="Password" />
						</div>
						<button className="button login__submit">
							<span className="button__text">Log In Now</span>
							<Send />
						</button>
					</form>
					<div className="social-login">
						<h3>New user ?</h3>
						<div className="social-icons">
							<a className="register" href="/Register" >register here</a>
						</div>
					</div>
				</div>
				<div className="screen__background">
					<span className="screen__background__shape screen__background__shape4"></span>
					<span className="screen__background__shape screen__background__shape3"></span>
					<span className="screen__background__shape screen__background__shape2"></span>
					<span className="screen__background__shape screen__background__shape1"></span>
				</div>
			</div>
		</div>
	</>
}
export default Login;