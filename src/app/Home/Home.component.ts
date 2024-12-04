import { Component, OnInit, ViewChild } from '@angular/core';
import { API_ServiceService } from '../API_Service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css'],
  imports: [MatPaginator,MatTableModule,FormsModule]
})
export class HomeComponent implements OnInit {
  data: any = []
  filteredData: any = []
  displayedColumns: string[] = ['ProductName', 'QuantityPerUnit', 'UnitPrice', 'UnitsInStock'];
  dataSource = new MatTableDataSource<any>(this.filteredData);
  searchQuery:string =''
  @ViewChild(MatPaginator) paginator: MatPaginator | null=null;

  constructor(private apiService: API_ServiceService) { }

  async ngOnInit() {
    await this.apiService.getProduct().subscribe((res)=> {
      this.data = res
      this.filteredData = res
      this.dataSource.data = this.filteredData
      console.log("API Product data : ", this.data)
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // เชื่อมโยง paginator กับ MatTableDataSource
  }

  applyFilter() {
    if(this.searchQuery == "") {
      this.filteredData = this.data
    }
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.dataSource.filter = filterValue;  // ใช้ filter ของ MatTableDataSource
  }
}
