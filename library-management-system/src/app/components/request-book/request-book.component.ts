import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/models/book';
import { RequestBook } from 'src/app/models/request-book';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { RequestBookService } from 'src/app/services/request-book.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-book',
  templateUrl: './request-book.component.html',
  styleUrls: ['./request-book.component.css']
})
export class RequestBookComponent implements OnInit {

  bookId?:number;
  mailId?:string;
  book:Book;
  user:User;
  requestBook?:RequestBook
  requestBookForm?:FormGroup
  constructor(public router:Router,public bookService:BookService,public requestBookService:RequestBookService,public userService:UserService,public activatedRoute:ActivatedRoute,
    public formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.book=new Book()
    this.user=new User()
    this.requestBook=new RequestBook()
    this.bookId = this.activatedRoute.snapshot.params['bookId'];
    this.mailId = this.activatedRoute.snapshot.params['mailId'];
    this.bookService.getBookById(this.bookId).
    subscribe(data=>{
      
      this.book=data

  
    }) 
  
  this.userService.getUserByMailId(this.mailId).subscribe(data=>{
   
    this.user=data


  })
  


  this.requestBookForm = this.formBuilder.group({

 numberOfDays: ['',[ Validators.required,Validators.max(25)]]

  })
  }
 

  addRequestBook(){
    this.requestBook.book=this.book
  this.requestBook.user=this.user
    this.requestBook.numberOfDays=this.requestBookForm?.get('numberOfDays').value
    this.requestBook.requestId=-1
  
   this.requestBookService.addRequestBookDetails(this.requestBook).subscribe(
    response => {
    },error => {
      this.successNotification();
      this.router.navigate(['userfunctions',this.mailId])
    })
  }

    return(){
      this.router.navigate(['userfunctions',this.mailId])
    }

    successNotification(){
      Swal.fire('Success', 'Book request sent Successfully!', 'success')
    }
}
