import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Countries } from 'src/app/modules/countries';
import { CountriesService } from 'src/app/services/countries.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  public countriesData: Countries[] | undefined
  public lithuaniaArea: null | number = null

  public pageSlice: Countries[] | undefined

  constructor(public countriesService: CountriesService) { }

  ngOnInit(): void {
    this.showCountries()
  }

  public showCountries() {
      this.countriesService.getCountries().subscribe((data: any) => {
        this.countriesData = data as Countries[]
        this.pageSlice = this.countriesData
      })
  }

  public filterName(value:number) {
    this.countriesData?.sort((a, b)=> {
      if (a.name > b.name) {
        return value
      }
      if (b.name > a.name) {
        return -value
      }
      return 0
    })
  }

  public filterArea(value:boolean) {
    this.countriesData?.sort((a, b) => {
      if (a.area == null) {
        a.area = 0
      }
      if (b.area == null) {
        b.area = 0
      }
      if (value) {
        return a.area - b.area
      } else {
        return b.area - a.area
      }
    })
    // this.countriesData?.sort((a, b)=> value ? a.area - b.area : b.area - a.area)
  }

  public getLithuaniaArea() {
    if (this.countriesData) {
      this.countriesData.forEach(country => {
        if (country.name === 'Lithuania') {
          this.lithuaniaArea = country.area
        }
      })
    }
  }

  public smallerThanLithuaniaByArea() {
    this.getLithuaniaArea()
    this.countriesData = this.pageSlice
    this.countriesData = this.countriesData?.filter((country) => {
      if ( this.lithuaniaArea != null) {
        return country.area <= this.lithuaniaArea;
      } else {
        return this.smallerThanLithuaniaByArea()
      }
    });
  }

  public oceaniaRegion() {
    this.countriesData = this.pageSlice
    this.countriesData = this.countriesData?.filter((country)=> {
      return country.region === 'Oceania'
    })
  }

  public countCountries() {
    return this.countriesData?.length
  }

  public onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize
    let endIndex = startIndex + event.pageSize

    this.countriesData = this.pageSlice
    
    if (this.countriesData) {
      if (endIndex > this.countriesData.length) {
        endIndex = this.countriesData.length
      }
    this.countriesData = this.countriesData?.slice(startIndex,endIndex)
    } 
  }

}
