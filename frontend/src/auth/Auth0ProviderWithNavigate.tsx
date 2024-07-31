//contains code that uses sdk to connect to auth0

import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

type Props={
    children:React.ReactNode;
}

const Auth0ProviderWithNavigate = ({children}:Props) => {

    //CONTAINS CREDENTIALS TO CONNECT TO AUTH0
  const domain=import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId=import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri=import.meta.env.VITE_AUTH0_CALLBACK_URL;
const audience=import.meta.env.VITE_AUTH0_AUDIENCE;
  const navigate=useNavigate();
// above variables comes from env file
  if(!domain || !clientId || !redirectUri || !audience){
    throw new Error("unable to initialise auth!");
  }
  //appState -contains stored data which might be useful when user redirect to app after login (storing current url of user before login and redirecting to it after login)
  //user -details of logined user email,.. 
//function is called when user gets redirected back to login page

//as fn is out of auth provider it cant access useAuth0 hook
  const onRedirectCallback=(appState?:AppState)=>{console.log(appState?.returntTo);
    navigate(appState?.returnTo  || "/auth-callback");
  }

  //auth provides which comes from sdk
//whenever user logs in auth0 page,it sends user info to aPP which is sent to uri that is added(redirect_ui)
//auth0provider passes appstate to onRedirectCallBack fn 
  return (
    <Auth0Provider 
    domain={domain}
     clientId={clientId} 
     authorizationParams={{ 
      redirect_uri: redirectUri,
      audience,
    }}
    onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider> 
  )
}
//fn is called when user  gets redirected back to app
export default Auth0ProviderWithNavigate  