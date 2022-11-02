import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  addBookForm?: FormGroup;
  isbnBook?: Book
  errorMessage: string;
  adminId?: number
  constructor(public bookService: BookService, public formBuilder: FormBuilder, public router: Router,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.adminId = this.activatedRoute.snapshot.params['adminId'];

    this.addBookForm = this.formBuilder.group({
      bookId: [-1],
      isbn: [-1],
      bookName: ['', Validators.required],
      authorName: ['', Validators.required],
      publisher: ['', Validators.required],
      genre: ['', Validators.required],
      volume: ['', Validators.required],
      edition: ['', Validators.required]
    })
  }


  addBookDetails() {
    this.bookService.addBook(this.addBookForm?.value)
      .subscribe(
        response => {
        }, error => {
          this.successNotification();
          this.router.navigate(['adminfunctions', this.adminId])
        })


  }
 
  return() {
    this.router.navigate(['adminfunctions', this.adminId])
  }
  successNotification() {
    Swal.fire('Success', 'Book Added Successfully!', 'success')
  }
}


