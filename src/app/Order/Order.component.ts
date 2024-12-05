import { Component, OnInit, ViewChild } from '@angular/core';
import { API_ServiceService } from '../API_Service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-Order',
  templateUrl: './Order.component.html',
  styleUrls: ['./Order.component.css'],
  imports: [MatPaginator, MatTableModule, FormsModule, NgIf],
})
export class OrderComponent implements OnInit {
  data: any = [];
  filteredDateData: any = [];
  orderData: any = [];
  mergedData: any = [];
  displayedColumns: string[] = [
    'OrderDate',
    'CustomerID',
    'ProductName',
    'UnitPrice',
  ];
  // selectedDate: string = '';
  totalSales: number = 0;
  isVisible: boolean = false;
  headerSales: string = '';
  dataSource = new MatTableDataSource<any>(this.filteredDateData);
  searchQuery: string = '';

  searchType: string = 'day'; // ค่าเริ่มต้นเป็น "รายวัน"
  selectedDate: string | null = null; // ค่าวันที่
  selectedMonthYear: string = '';
  selectedYear: string | null = null; // ค่ารายปี
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  constructor(private apiService: API_ServiceService) {}

  ngOnInit() {
    this.fetchOrder();
  }

  async fetchOrder() {
    forkJoin({
      orders: this.apiService.getOrder(),
      products: this.apiService.getProduct(),
    }).subscribe(({ orders, products }) => {
      this.data = orders;
      this.orderData = products;

      this.mergedData = this.data.map((item1: any) => {
        const product = this.orderData.find(
          (item2: any) => item1.ProductID === item2.ProductID
        );
        return {
          ...item1,
          ProductName: product.ProductName,
        };
      });
      console.log('Merge Data : ', this.mergedData);
      this.filteredDateData = this.mergedData.sort((a: any, b: any) => {
        return (
          new Date(b.OrderDate).getTime() - new Date(a.OrderDate).getTime()
        );
      });
      console.log('Data from Orders : ', this.filteredDateData);
      this.dataSource = new MatTableDataSource<any>(this.filteredDateData);
      this.dataSource.paginator = this.paginator; // เชื่อม paginator
      console.log('Data from Orders: ', this.filteredDateData);
    });
  }

  applyFilter() {
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.dataSource.filter = filterValue; // ใช้ filter ของ MatTableDataSource
  }

  // filterSalesByDate(rangeType: 'day' | 'month' | 'year', date: string) {
  //   const targetDate = new Date(date);
  //   console.log("Target Date : ", targetDate)
  //   let filteredData: any[] = [];

  //   if (rangeType === 'day') {
  //     filteredData = this.data.filter((item: any) => {
  //       const orderDate = new Date(item.OrderDate);
  //       return (
  //         orderDate.getDate() === targetDate.getDate() &&
  //         orderDate.getMonth() === targetDate.getMonth() &&
  //         orderDate.getFullYear() === targetDate.getFullYear()
  //       );
  //     });
  //   } else if (rangeType === 'month') {
  //     filteredData = this.data.filter((item: any) => {
  //       const orderDate = new Date(item.OrderDate);
  //       return (
  //         orderDate.getMonth() === targetDate.getMonth() &&
  //         orderDate.getFullYear() === targetDate.getFullYear()
  //       );
  //     });
  //   } else if (rangeType === 'year') {
  //     filteredData = this.data.filter((item: any) => {
  //       const orderDate = new Date(item.OrderDate);
  //       return orderDate.getFullYear() === targetDate.getFullYear();
  //     });
  //   }

  //   // คำนวณยอดขายรวมของ UnitPrice
  //   const totalSales = filteredData.reduce((sum: number, item: any) => {
  //     return sum + item.UnitPrice * item.Quantity; // รวม UnitPrice * Quantity
  //   }, 0);

  //   console.log(`Filtered Data (${rangeType}):`, filteredData);
  //   console.log(`Total Sales (${rangeType}):`, totalSales);

  //   return { filteredData, totalSales };
  // }

  onSearchTypeChange(): void {
    this.selectedDate = null;
    this.selectedMonthYear = '';
    this.selectedYear = null;
  }

  submitSearch(): void {
    let payload: any;

    switch (this.searchType) {
      case 'day':
        if (!this.selectedDate) {
          alert('กรุณาเลือกวันที่!');
          return;
        }
        this.filterAndCalculateTotal('day');
        this.headerSales = "ยอดขายรวม : "
        payload = { type: 'day', date: this.selectedDate };
        break;

      case 'monthYear':
        if (!this.selectedMonthYear) {
          alert('กรุณาเลือกเดือนและปี!');
          return;
        }
        this.filterAndCalculateTotal('monthYear');
        this.headerSales = "ยอดขายรวม : "
        payload = { type: 'monthYear', monthYear: this.selectedMonthYear };
        break;

      case 'year':
        if (!this.selectedYear) {
          alert('กรุณาเลือกปี!');
          return;
        }
        this.filterAndCalculateTotal('year');
        this.headerSales = "ยอดขายรวม : "
        payload = { type: 'year', year: this.selectedYear };
        break;

      default:
        alert('กรุณาเลือกประเภทการค้นหา!');
        return;
    }
    this.isVisible = true;

    console.log('ส่งข้อมูล:', payload);
    // เรียก API เพื่อประมวลผล payload
    // this.searchSales(payload);
  }

  filterAndCalculateTotal(type: string): void {
    let filteredData: any[] = [];

    if (type === 'day' && this.selectedDate) {
      const selectedDate = new Date(this.selectedDate);
      filteredData = this.filteredDateData.filter((item: any) => {
        const orderDate = new Date(item.OrderDate);
        return (
          orderDate.getDate() === selectedDate.getDate() &&
          orderDate.getMonth() === selectedDate.getMonth() &&
          orderDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    } else if (type === 'monthYear' && this.selectedDate) {
      const [year, month] = this.selectedMonthYear.split('-').map(Number);
      filteredData = this.filteredDateData.filter((item: any) => {
        const orderDate = new Date(item.OrderDate);
        return (
          orderDate.getFullYear() === year && orderDate.getMonth() === month - 1
        );
      });
    } else if (type === 'year' && this.selectedYear) {
      const year = parseInt(this.selectedYear, 10);
      filteredData = this.filteredDateData.filter((item: any) => {
        const orderDate = new Date(item.OrderDate);
        return orderDate.getFullYear() === year;
      });
    }

    this.totalSales = filteredData.reduce((sum: number, item: any) => {
      return sum + item.UnitPrice;
    }, 0);

    console.log(`Filtered Data (${type}):`, filteredData);
    console.log(`Total Sales (${type}):`, this.totalSales);
  }

}
