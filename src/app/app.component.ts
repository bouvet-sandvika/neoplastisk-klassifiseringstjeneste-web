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
  pasients = [
    { "id": 1,"alder": 43, "kommune": "Bergen", "aiMalignant": undefined, "biopsiMalignant": undefined },
    { "id": 2,"alder": 67, "kommune": "Molde", "aiMalignant": undefined, "biopsiMalignant": undefined },
    { "id": 3,"alder": 56, "kommune": "Ullensvang", "aiMalignant": undefined, "biopsiMalignant": undefined },
    { "id": 4,"alder": 61, "kommune": "Bryne", "aiMalignant": undefined, "biopsiMalignant": undefined },
    { "id": 5,"alder": 48, "kommune": "Oslo", "aiMalignant": undefined, "biopsiMalignant": undefined }
  ]

  async predict(id) {

    let pasientData;
    await fetch("http://localhost:4211/ny-pasient?id=" + id,
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
        pasientData = {
          "id": id,
          "data": res.tumorData
        };
      }
    ).catch(function() {
      console.log("Error from biopsi service");
    });
    
    if(pasientData !== undefined) {
      await fetch("http://localhost:4210/pasient", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: 'POST',
        body: JSON.stringify(pasientData)
      })
      .then(res => res.json())
      .then(res => {
        if(res.status === "OK") {
          this.pasients.forEach((pasient) => {
            if(pasient.id === pasientData.id) {
              if(res.tumor_type === 'malignant') {
                pasient.aiMalignant = true;
              } else if (res.tumor_type === 'benignt') {
                pasient.aiMalignant = false;
              }
            }
          });
        }
        
      }).catch(function() {
        console.log("Error from AI service");
      });
    }
    
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
      this.pasients.forEach((pasient) => {
        if(pasient.id === id) {
          if(res.result === 'benignt') {
            pasient.biopsiMalignant = false;
          } else if(res.result === 'malignant') {
            pasient.biopsiMalignant = true;
          }
        }
      });
      }
    ).catch(function() {
      console.log("Error from biopsi service");
    });
    return response;
  }

  viewTumorData(id) {
    console.log("Hent tumor data");
    this.modalService.open("<p>Test</p>", { size: 'lg' });
  }

  
}
