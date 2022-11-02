import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueBook } from 'src/app/models/issue-book';
import { User } from 'src/app/models/user';
import { IssueBookService } from 'src/app/services/issue-book.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-return-book',
  templateUrl: './return-book.component.html',
  styleUrls: ['./return-book.component.css']
})
export class ReturnBookComponent implements OnInit {
  mailId?: string
  returnForm?: FormGroup
  issueDetails: IssueBook
  fine: number

  details?: IssueBook[] = []
  user?: User
  userId?: number
  constructor(public router: Router, public userService: UserService, public issueBookService: IssueBookService, public activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.mailId = this.activatedRoute.snapshot.params['mailId'];
    this.userService.getUserByMailId(this.mailId).subscribe(data => {

      this.user = data
      this.userId = this.user.userId
      this.issueBookService.getIssueDetailsByUserId(this.userId).subscribe(res => {
       
        this.details = res
      })
    })
    this.returnForm = this.formBuilder.group({

      issueId: ['', Validators.required],
    })


  }
  returnBook() {
    this.issueBookService.getIssueDetailsByIssueId(this.returnForm.get('issueId').value).subscribe(res => {
      this.issueDetails = res
      this.fine = this.issueDetails.fineAmount
      this.issueBookService.deleteIssueDetails(this.returnForm.get('issueId').value).subscribe(data => {

      }, error => {

        this.successNotification()
      })
    })

  }
  return() {
    this.router.navigate(['userfunctions', this.mailId])
  }
  successNotification() {
    Swal.fire('Success', 'You have fine amount RS.' + this.fine + ' for the issued book.Please ensure that you have paid fine after returning the book!', 'success')
  }
}
