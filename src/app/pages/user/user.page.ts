import { Component, OnInit } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { post } from 'selenium-webdriver/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  constructor(
    private fb: Facebook,
    private nativeStorage: NativeStorage,
    public loadingController: LoadingController,
    private router: Router,
    private platform: Platform,
  ) { }

  public facebookInfo = {
    name: '',
    picture: ''
  };

  public posts = {
    message: ''
  };
  ngOnInit() {
    this.nativeStorage.getItem('facebook_user').then(result => {
      if (result != null) {
        this.facebookInfo = result;
        console.log('RESULT', result);
      }

    }).catch(e => {
      console.log('error: ' + e);
      // Handle errors here
    });


    this.nativeStorage.getItem('posts').then(result => {
      if (result != null) {
        this.posts = result;
        console.log('RESULT post', result);

        this.posts = result;

        console.log('post array ', this.posts);
      }

    }).catch(e => {
      console.log('error: ' + e);
      // Handle errors here
    });

  }

  postDetail(post: any) {
    if (post.message) {
      return post.message;
    } else if (post.description) {
      return post.description;
    } else {
      return 'No message available';
    }
  }


  doFbLogout() {
    this.fb.logout()
      .then(res => {
        this.nativeStorage.remove('facebook_user');
        this.router.navigate(["/login"]);
      }, error => {
        console.log(error);
      });
  }

}
