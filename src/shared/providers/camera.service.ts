// import {Injectable, OnInit} from '@angular/core';
// import {NavController, LoadingController, ActionSheetController } from 'ionic-angular';
// import { Camera, CameraOptions } from 'ionic-native';

// import { IUser } from '../../shared/interfaces';
// import { AuthService } from '../../shared/services/auth.service';
// import { DataService } from '../../shared/services/data.service';

// @Injectable()
// export class cameraService implements OnInit {
//   userDataLoaded: boolean = false;
//   uid: string ;

//   constructor(public navCtrl: NavController,
//     public loadingCtrl: LoadingController,
//     public actionSheeCtrl: ActionSheetController,
//     ) { }

//     getUserImage() {
//     //return self.dataService.getStorageRef().child('images/' + self.firebaseAccount.uid + '/profile.png').getDownloadURL();
//     //go to storage.then->to domm
//     }

//     openImageOptions() {

//     let actionSheet = this.actionSheeCtrl.create({
//       title: 'Upload new image from',
//       buttons: [
//         {
//           text: 'Camera',
//           icon: 'camera',
//           handler: () => {
//             this.openCamera(Camera.PictureSourceType.CAMERA);
//           }
//         },
//         {
//           text: 'Album',
//           icon: 'folder-open',
//           handler: () => {
//             this.openCamera(Camera.PictureSourceType.PHOTOLIBRARY);
//           }
//         }
//       ]
//     });

//     actionSheet.present();
//   }

//   openCamera(pictureSourceType: any) {
//     let options: CameraOptions = {
//       quality: 95,
//       destinationType: Camera.DestinationType.DATA_URL,
//       sourceType: pictureSourceType,
//       encodingType: Camera.EncodingType.PNG,
//       targetWidth: 400,
//       targetHeight: 400,
//       saveToPhotoAlbum: true,
//       correctOrientation: true
//     };

//     Camera.getPicture(options).then(imageData => {
//       const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
//         const byteCharacters = atob(b64Data);
//         const byteArrays = [];

//         for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//           const slice = byteCharacters.slice(offset, offset + sliceSize);

//           const byteNumbers = new Array(slice.length);
//           for (let i = 0; i < slice.length; i++) {
//             byteNumbers[i] = slice.charCodeAt(i);
//           }

//           const byteArray = new Uint8Array(byteNumbers);

//           byteArrays.push(byteArray);
//         }

//         const blob = new Blob(byteArrays, { type: contentType });
//         return blob;
//       };

//       let capturedImage: Blob = b64toBlob(imageData, 'image/png');
//       this.startUploading(capturedImage);
//     }, error => {
//       console.log('ERROR -> ' + JSON.stringify(error));
//     });
//   }

//   reload() {
//     this.loadUserProfile();
//   }

//   startUploading(file) {

//     let progress: number = 0;
//     // display loader
//     let loader = this.loadingCtrl.create({
//       content: 'Uploading image..',
//     });
//     loader.present();

//     // Upload file and metadata to the object 'images/mountains.jpg'
//     var metadata = {
//       contentType: 'image/png',
//       name: 'profile.png',
//       cacheControl: 'no-cache',
//     };

//     var uploadTask = self.dataService.getStorageRef().child('images/' + uid + '/profile.png').put(file, metadata);

//     // Listen for state changes, errors, and completion of the upload.
//     uploadTask.on('state_changed',
//       function (snapshot) {
//         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//         progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       }, function (error) {
//         loader.dismiss().then(() => {
//           switch (error.code) {
//             case 'storage/unauthorized':
//               // User doesn't have permission to access the object
//               break;

//             case 'storage/canceled':
//               // User canceled the upload
//               break;

//             case 'storage/unknown':
//               // Unknown error occurred, inspect error.serverResponse
//               break;
//           }
//         });
//       }, function () {
//         loader.dismiss().then(() => {
//           // Upload completed successfully, now we can get the download URL
//           var downloadURL = uploadTask.snapshot.downloadURL;
//           self.dataService.setUserImage(uid);
//           self.reload();
//         });
//       });
//   }
// }