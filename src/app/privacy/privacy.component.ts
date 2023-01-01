import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../shared/services/repository.service';
import { Claim } from '../_interfaces/authentication/claim.model';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  public claims : Claim[] = [];

  constructor(private repository: RepositoryService) {}

  ngOnInit(): void {
    this.getClaims();
  }

  public getClaims = () => {
    this.repository.getClaims('privacy').subscribe(res => {
      this.claims = res as Claim[]
    })
  }

}
