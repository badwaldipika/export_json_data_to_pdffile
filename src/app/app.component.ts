import { Component } from '@angular/core';
import { environment } from '../../src/environments/environment';
import * as XLSX from 'xlsx';
import { FileSaverService } from 'ngx-filesaver';
import { RestAPIService } from '../../src/app/services/restapi.service';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private filersaver: FileSaverService, private restapi: RestAPIService) { }

  title = 'Export to PDF Demo';


  async pdfExport() {

    var response = await this.getData().subscribe({
      next: (response) => {
        const pdf = new jsPDF();
        pdf.setFontSize(20);
        pdf.text("Application Records", 11, 8);

        autoTable(pdf,
          {
            margin: { top: 10, bottom: 10, left: 10, right: 10 },
            body: response,
            columns: [
              { header: 'App Id', dataKey: 'app_id' },
              { header: 'Name', dataKey: 'name' },
              { header: 'Description', dataKey: 'description' },
              { header: 'Connection Type', dataKey: 'connection_type' },
              { header: 'Application Aproval Type', dataKey: 'name' },
              { header: 'Is Sox Audit?', dataKey: 'is_sox_auditable' },
              { header: 'Required Impact Assessment', dataKey: 'required_impact_assessment' },
              { header: 'Is high risk Editable?', dataKey: 'is_high_risk_editable' },

            ],
            theme: 'striped',
            didDrawCell: (data: { column: { index: any; }; }) => {
              console.log(data.column.index)
            }
          })
        pdf.output('dataurlnewwindow');
        pdf.save('demo.pdf');


      },
      error: (error) => console.error(error)
    });;

  }


  getData(): Observable<any> {
    const requestUrl = `${environment.apiURL}application/list?sort=app_id&order=asc&page=1&per_page=40&filter=`;
    return this.restapi.get<Array<any>>(requestUrl);
  }
}
