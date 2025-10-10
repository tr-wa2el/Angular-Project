import { Component, OnDestroy, afterNextRender, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.css'
})
export class BackToTopComponent implements OnDestroy {
  showBackToTop = false;
  private animationFrameId?: number;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private viewportScroller: ViewportScroller,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.startScrollTracking();
    });
  }

  private startScrollTracking(): void {
    const checkScroll = () => {
      // Get scroll from body (where the actual scroll is happening)
      const scrollY = this.document.body.scrollTop ||
                     window.scrollY ||
                     window.pageYOffset ||
                     this.document.documentElement.scrollTop;

      const newShowBackToTop = scrollY > 300;

      if (newShowBackToTop !== this.showBackToTop) {
        this.showBackToTop = newShowBackToTop;
        this.cdr.detectChanges();
      }

      this.animationFrameId = requestAnimationFrame(checkScroll);
    };

    checkScroll();
  }

  scrollToTop(): void {
    // Scroll the body (where the actual scroll is happening)
    this.document.body.scrollTo({ top: 0, behavior: 'smooth' });

    // Also try other methods as fallback
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
