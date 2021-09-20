import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color, SingleDataSet } from 'ng2-charts';
import { ToastrService } from 'ngx-toastr';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';
import { EmployeeClass } from '../pagesModel';
import { deleteEmployeeURL, getAllEmployee, getEmployeeByIdURL, postEmployee, putEmployee } from '../pagesURL';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // == Pagination ==
  POSTS: any;
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [3, 6, 9, 12];

  // == Pie Chart ==
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['SciFi'], ['Drama'], 'Comedy'];
  public pieChartData: SingleDataSet = [30, 50, 20];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  // == Bar Chart ==
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [45, 37, 60, 70, 46, 33], label: 'Best Fruits' }
  ];

  // ====

  employeeForm: FormGroup;
  employeeModel = new EmployeeClass();

  closeResult: string = '';
  submitted = false;
  getAllEmployeeList: any[];
  isEdit: boolean = true;

  constructor(private formBuilder: FormBuilder, private router: Router, private httpService: HttpmethodsService, public toastr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      employeeFName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      employeeLName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      employeeAddress: new FormControl('', [Validators.required]),
      employeeDOB: new FormControl('', [Validators.required]),
      employeeContactNo: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      employeeCity: new FormControl('', [Validators.required]),
    });
    this.getAll();
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
 }

  get f() { return this.employeeForm.controls; }

  // == Save Employee ==
  onSubmit() {
    this.submitted = true;
    if (this.employeeForm.invalid) {
      return;
    }
    if (this.isEdit) {
      this.httpService.postRequest(postEmployee, this.employeeModel).subscribe((data: any) => {
        this.toastr.success('Succesfully Registered', 'Registration Success');
        this.getAll();
        this.isEdit = true;
      },
        error => {
          this.toastr.error('Please check again!', 'Registration Falied');
        });
    }
    else {
      this.httpService.putRequest(putEmployee + "/" + this.employeeModel.id, this.employeeModel).subscribe((data: any) => {
        this.toastr.success('Succesfully Updated', 'Registration Update');
        this.getAll();
        this.isEdit = true;
      },
        error => {
          this.toastr.error('Please check again!', 'Registration Falied');
        });
    }
  }

  // == Get All Manager List ==
  getAll() {
    this.httpService.getRequest(getAllEmployee).subscribe((data: any) => {
      this.getAllEmployeeList = data;
    });
  }

  // == Get All Manager By Id ==
  getById(id: number, content: any) {
    this.httpService.getRequest(getAllEmployee + "/" + id).subscribe((data: any) => {
      this.employeeModel = data;
      this.open(content)
      this.isEdit = false;
    });
  }

  // == Delete Manager By Id ==
  deleteEmployee(id: number, content: any) {
    this.httpService.deleteRequest(deleteEmployeeURL + "/" + id).subscribe((data: any) => {
      this.getAll();
      this.modalService.dismissAll(content);
    });
  }

  // == Delete Manager Modal Confirmation ==
  deletePopup(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' },).result.then((result) => {
    });
  }

  // == Open Modal ==
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' },).result.then((result) => {
    });
  }

  // == Pagination ==
  onTableDataChange(event: any) {
    this.page = event;
  }
}
