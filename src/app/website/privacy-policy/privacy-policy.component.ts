import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.scss'],
    standalone: false
})
export class PrivacyPolicyComponent implements OnInit {

  cardText: string = `Your Privacy, Our Priority
Committed to Protecting Your Information.`;

  constructor(
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Privacy Policy - Carina Softlabs Inc.');
    this.metaService.updateTag({
      name: 'description',
      content: 'Read the Privacy Policy of Carina Softlabs Inc. to understand the rules and guidelines for using our website and services.'
    });
  }
}