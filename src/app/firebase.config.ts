import {AuthProviders, AuthMethods } from 'angularfire2';

export const firebaseConfig = 
{
    apiKey: "AIzaSyDDhRl4vbvXaEAq-WnDFLM2lhXCW1lng_k",
    authDomain: "studentattendence.firebaseapp.com",
    databaseURL: "https://studentattendence.firebaseio.com",
    storageBucket: "studentattendence.appspot.com",
}

export const DefulatfireBaseAuthAnonConfig = 
{
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}