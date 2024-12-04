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
  selectedDate: string = '';
  totalSales: number = 0;
  isVisible: boolean = false;
  headerSales: string = '';
  dataSource = new MatTableDataSource<any>(this.filteredDateData);
  searchQuery: string = '';
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

  filterSalesByDate(rangeType: 'day' | 'month' | 'year', date: string) {
    const targetDate = new Date(date);
    let filteredData: any[] = [];

    if (rangeType === 'day') {
      filteredData = this.data.filter((item: any) => {
        const orderDate = new Date(item.OrderDate);
        return (
          orderDate.getDate() === targetDate.getDate() &&
          orderDate.getMonth() === targetDate.getMonth() &&
          orderDate.getFullYear() === targetDate.getFullYear()
        );
      });
    } else if (rangeType === 'month') {
      filteredData = this.data.filter((item: any) => {
        const orderDate = new Date(item.OrderDate);
        return (
          orderDate.getMonth() === targetDate.getMonth() &&
          orderDate.getFullYear() === targetDate.getFullYear()
        );
      });
    } else if (rangeType === 'year') {
      filteredData = this.data.filter((item: any) => {
        const orderDate = new Date(item.OrderDate);
        return orderDate.getFullYear() === targetDate.getFullYear();
      });
    }

    // คำนวณยอดขายรวมของ UnitPrice
    const totalSales = filteredData.reduce((sum: number, item: any) => {
      return sum + item.UnitPrice * item.Quantity; // รวม UnitPrice * Quantity
    }, 0);

    console.log(`Filtered Data (${rangeType}):`, filteredData);
    console.log(`Total Sales (${rangeType}):`, totalSales);

    return { filteredData, totalSales };
  }

  getSalesByDay() {
    const result = this.filterSalesByDate('day', this.selectedDate);
    this.totalSales = result.totalSales;
    this.headerSales = 'ยอดขายประจำวัน';
    console.log('selectedDate : ', this.selectedDate);
    if (this.selectedDate === '') {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
  }

  getSalesByMonth() {
    const result = this.filterSalesByDate('month', this.selectedDate);
    this.totalSales = result.totalSales;
    this.headerSales = 'ยอดขายประจำเดือน';
    if (this.selectedDate == '') {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
  }

  getSalesByYear() {
    const result = this.filterSalesByDate('year', this.selectedDate);
    this.totalSales = result.totalSales;
    this.headerSales = 'ยอดขายประจำปี';
    if (this.searchQuery == '') {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
  }
}
