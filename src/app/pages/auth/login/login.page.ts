import { Component, OnInit } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  FB_APP_ID = 687543111724940;

  formModel = {};

  constructor(
    private fb: Facebook,
    private nativeStorage: NativeStorage,
    public loadingController: LoadingController,
    private router: Router,
    private platform: Platform,
  ) { }

  ngOnInit() {
  }


  async doFbLogin() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    let permissions = new Array<string>();

    permissions = ['public_profile', 'email', 'user_posts'];

    console.log('1111');
    this.fb.login(permissions)
      .then(response => {
        const userId = response.authResponse.userID;
        console.log('2222 ', userId);
        this.fb.api('/me?fields=name,email', permissions)
          .then(user => {
            user.picture = 'https://graph.facebook.com/' + userId + '/picture?type=large';
            console.log('user info ' + user.name + ' ' + user.email);
            this.nativeStorage.setItem('facebook_user',
              {
                name: user.name,
                email: user.email,
                picture: user.picture,
                id: userId
              })
              .then(() => {

                const info = this.nativeStorage.getItem('facebook_user');


                this.fb.api('/me/posts?fields=created_time,from,id,description,caption,message,permalink_url', permissions).then(posts => {
                  this.router.navigate(['/user']);
                  loading.dismiss();
                  this.nativeStorage.setItem('posts', posts);
                });

              }, error => {
                console.log(error);
                loading.dismiss();
              });
          });
      }, error => {
        console.log(error);
        loading.dismiss();
      });
  }

  async presentLoading(loading) {
    return await loading.present();
  }
}
