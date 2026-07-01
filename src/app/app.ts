import { Component, HostListener, signal, AfterViewInit, OnDestroy, ElementRef, inject } from '@angular/core';

interface Project {
  num: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  emoji: string;
  accent: string;
}

interface Skill {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private observer!: IntersectionObserver;
  private intervals: ReturnType<typeof setInterval>[] = [];
  private statsAnimated = false;

  scrolled    = signal(false);
  menuOpen    = signal(false);
  heroTitle   = signal('');
  typingDone  = signal(false);
  cursorX     = signal(-100);
  cursorY     = signal(-100);
  cursorBig   = signal(false);
  stat1       = signal(0);   // bots
  stat2       = signal(0);   // uptime

  private readonly fullTitle = 'Construyo automatizaciones que trabajan mientras dormís.';

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 50); }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.cursorX.set(e.clientX);
    this.cursorY.set(e.clientY);
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(e: MouseEvent) {
    const target = e.target as HTMLElement;
    this.cursorBig.set(!!(target.closest('a, button, .skill-chip, .project-card')));
  }

  toggleMenu() { this.menuOpen.update(v => !v); }
  closeMenu()  { this.menuOpen.set(false); }

  ngAfterViewInit() {
    this.startTyping();
    this.setupScrollObserver();
  }

  private startTyping() {
    let i = 0;
    const t = setInterval(() => {
      this.heroTitle.update(v => v + this.fullTitle[i]);
      i++;
      if (i >= this.fullTitle.length) {
        clearInterval(t);
        this.typingDone.set(true);
      }
    }, 38);
    this.intervals.push(t);
  }

  private setupScrollObserver() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('stats-trigger') && !this.statsAnimated) {
            this.statsAnimated = true;
            this.animateCounter(5,  v => this.stat1.set(v), 1200);
            this.animateCounter(100, v => this.stat2.set(v), 1800);
          }
        }
      });
    }, { threshold: 0.15 });

    const targets = this.el.nativeElement.querySelectorAll('.fade-up, .stats-trigger');
    targets.forEach((el: Element) => this.observer.observe(el));
  }

  private animateCounter(target: number, setter: (v: number) => void, duration: number) {
    const start = Date.now();
    const t = setInterval(() => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setter(Math.round(eased * target));
      if (p >= 1) { setter(target); clearInterval(t); }
    }, 16);
    this.intervals.push(t);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.intervals.forEach(t => clearInterval(t));
  }

  projects: Project[] = [
    {
      num: '01',
      title: 'Sofía',
      subtitle: 'Bot Instagram — Gestoría Automotor',
      description: 'Asistente virtual en Instagram que captura leads calificados para una gestoría automotor. Detecta el tipo de trámite, recolecta documentación y notifica al gestor por Telegram en tiempo real. Activo con clientes reales desde junio 2026.',
      tags: ['n8n', 'Meta API', 'OpenAI GPT-4o', 'Google Sheets', 'Telegram'],
      emoji: '🤖',
      accent: '#c084fc'
    },
    {
      num: '02',
      title: 'Olivia',
      subtitle: 'Bot WhatsApp — Turnos & Cotizador',
      description: 'Bot de WhatsApp con máquina de estados que cotiza trámites DNRPA, gestiona el perfil del comprador/vendedor, verifica documentación pendiente y agenda turnos en Google Calendar con recordatorios automáticos.',
      tags: ['n8n', 'WhatsApp Business API', 'OpenAI', 'Google Calendar', 'PostgreSQL'],
      emoji: '📅',
      accent: '#38bdf8'
    },
    {
      num: '03',
      title: 'Facturador SaaS',
      subtitle: 'Facturación automática para monotributistas',
      description: 'Sistema multi-tenant que detecta pagos aprobados en Mercado Pago, pide confirmación por email y emite la Factura C ante AFIP automáticamente. Genera PDF con QR oficial (RG 4291/2018) y lo envía al cliente. Credenciales cifradas con AES-256.',
      tags: ['n8n', 'Mercado Pago API', 'AFIP WSFE', 'PostgreSQL', 'Gotenberg', 'Docker'],
      emoji: '🧾',
      accent: '#64ffda'
    },
    {
      num: '04',
      title: 'AxSalud',
      subtitle: 'Búsqueda de prestadores médicos con IA',
      description: 'Bot de Telegram que busca prestadores médicos de la Superintendencia de Salud con lenguaje natural. Base de 130.000 prestadores reales. El usuario escribe en lenguaje libre y recibe los más relevantes con dirección y teléfono.',
      tags: ['Telegram Bot', 'GPT-4o-mini', 'PostgreSQL', 'n8n', 'SSalud API'],
      emoji: '🏥',
      accent: '#f472b6'
    },
    {
      num: '05',
      title: 'Wara',
      subtitle: 'Vendedora IA — Electrodomésticos',
      description: 'Bot vendedora en Telegram para distribuidor mayorista/minorista de electrodomésticos. Responde consultas de stock, precios diferenciados por perfil de cliente y captura leads en Google Sheets para seguimiento comercial.',
      tags: ['Telegram Bot', 'Gemini AI', 'Google Sheets', 'n8n'],
      emoji: '🛒',
      accent: '#fb923c'
    }
  ];

  skills: Skill[] = [
    { name: 'n8n',           icon: '⚡' },
    { name: 'Angular 18',    icon: '🅰️' },
    { name: 'Node.js',       icon: '🟢' },
    { name: 'PostgreSQL',    icon: '🐘' },
    { name: 'OpenAI',        icon: '🧠' },
    { name: 'Gemini AI',     icon: '✨' },
    { name: 'WhatsApp API',  icon: '💬' },
    { name: 'Meta API',      icon: '📸' },
    { name: 'Mercado Pago',  icon: '💳' },
    { name: 'AFIP / WSFE',  icon: '🏛️' },
    { name: 'Docker',        icon: '🐳' },
    { name: 'Oracle Cloud',  icon: '☁️' },
    { name: 'Python',        icon: '🐍' },
    { name: 'TypeScript',    icon: '📘' },
  ];
}
