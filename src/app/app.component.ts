import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{

  constructor(private modalService: NgbModal) {}

  ngAfterViewInit(): void {
    console.log("Etter render");
  }

  ngOnInit(): void {
    console.log("Ved rendering");
  }

  title = 'Onkologisk klassifiseringstjeneste';
  predictionBenignant = false;
  predictionMalignant = false;
  biopsyBenignant = false;
  biopsyMalignant = false;

  async predict(id) {
    let body = {
      id: 1, 
      feature: {
        mean_radius: 0.3
      }
    }

    let response;
    await fetch("http://localhost:4210/pasient", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      method: 'POST',
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      response = res;
      if(response.status === "OK") {
        if(response.tumor_type === 'malignant') {
          console.log("DANGER");
        } else {
          console.log("NOT DANGER");
        }
      }
      
    });

    return response;
  }

  async biopsi(id) {

    let response;
    await fetch("http://localhost:4211/biopsi?id=" + id,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      }
    );

    return response;
  }

  viewTumorData(id) {
    console.log("Hent tumor data");
    this.modalService.open("<p>Test</p>", { size: 'lg' });
  }

  
}
