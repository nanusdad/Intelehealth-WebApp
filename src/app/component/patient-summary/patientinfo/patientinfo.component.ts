import { Component, OnInit } from '@angular/core';
import { ImagesService } from 'src/app/services/images.service';
import { ActivatedRoute } from '@angular/router';
import { VisitService } from 'src/app/services/visit.service';

@Component({
  selector: 'app-patientinfo',
  templateUrl: './patientinfo.component.html',
  styleUrls: ['./patientinfo.component.css']
})

export class PatientinfoComponent implements OnInit {
  baseURL = '13.233.50.223:8080';
image: string;
patientInfo = [];
info = {};
profileImagePresent = false;

constructor(private route: ActivatedRoute,
            private visitService: VisitService,
            private service: ImagesService) { }

  ngOnInit() {
      const uuid = this.route.snapshot.paramMap.get('patient_id');
      this.service.fetchProfileImage(uuid)
      .subscribe(response => {
        this.profileImagePresent = true;
        this.image = `http://${this.baseURL}/openmrs/ws/rest/v1/personimage/${uuid}`;
      });
      this.visitService.patientInfo(uuid)
      .subscribe(info => {
        this.info = info.person;
        this.info['attributes'].forEach(attri => {
          if (attri.attributeType.display.match('Telephone Number')) {
            this.info['telephone'] = attri.value;
          }
        });
        this.patientInfo.push(this.info);
      });
    }
}
