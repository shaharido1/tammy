import {AuthProviders, AuthMethods } from 'angularfire2';

export const databaseRootUrl = "https://studentattendence.firebaseio.com"
export const firebaseConfig = 
{
    apiKey: "AIzaSyDDhRl4vbvXaEAq-WnDFLM2lhXCW1lng_k",
    authDomain: "studentattendence.firebaseapp.com",
    databaseURL: databaseRootUrl,
    storageBucket: "studentattendence.appspot.com",
}

export const DefulatfireBaseAuthAnonConfig = 
{
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}