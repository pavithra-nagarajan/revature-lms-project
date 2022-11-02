import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueBook } from 'src/app/models/issue-book';
import { IssueBookService } from 'src/app/services/issue-book.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-functions',
  templateUrl: './admin-functions.component.html',
  styleUrls: ['./admin-functions.component.css']
})
export class AdminFunctionsComponent implements OnInit {

  adminId?: number
  issuedDetails: IssueBook[] = [];
  index?: number
  constructor(public router: Router, public activatedRoute: ActivatedRoute, public issueBookService: IssueBookService) { }

  ngOnInit(): void {
    this.adminId = this.activatedRoute.snapshot.params['adminId'];

  }

  viewAdminProfile() {
    this.router.navigate(['editadmin', this.adminId])
  }
  viewUsers() {
    this.router.navigate(['viewusers', this.adminId])

  }
  viewBooks() {
    this.router.navigate(['viewbooks', this.adminId])

  }
  addBooks() {
    this.router.navigate(['addbooks', this.adminId])

  }
  viewRequest() {
    this.router.navigate(['viewrequest', this.adminId])

  }
  viewIssuedDetails() {
    this.router.navigate(['viewissuedbooks', this.adminId])

  }
  updateFine() {
    this.issueBookService.getAllIssuedDetails().subscribe(data => {
      this.issuedDetails = data
      console.log(this.issuedDetails)
      for (this.index = 0; this.index < this.issuedDetails.length; this.index++) {
        console.log(this.issuedDetails[this.index].dueDate)
        console.log(this.issuedDetails[this.index].dueDate.getTime)
        console.log(new Date(this.issuedDetails[this.index].dueDate).getTime())
        console.log(new Date().getTime())
        if ((new Date(this.issuedDetails[this.index].dueDate).getTime()) < new Date().getTime()) {

          this.issueBookService.updateFine(this.issuedDetails[this.index].issueId).subscribe(data => {
            console.log("fine updated :" + data)

          }, error => {
            this.successNotification()
          })

        }
        else {
          console.log("********************else block")
        }
      }
    })

  }
  successNotification() {
    Swal.fire('Success', 'Fine Updated Successfully!', 'success')
  }


}
