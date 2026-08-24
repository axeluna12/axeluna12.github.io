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
      description: 'La gestoría perdía leads todos los días: los mensajes de Instagram llegaban fuera de horario o se acumulaban sin respuesta, y para cuando alguien contestaba el cliente ya había buscado en otro lado. Construí un asistente que responde al instante y detecta el tipo de trámite — pero el problema real no era conversar, era no ensuciar la base: agregué validación estructural (DNI, teléfono, últimos 7 dígitos del VIN) antes de guardar cualquier lead, porque un dato mal cargado significaba un gestor llamando a un número equivocado. Activo con clientes reales desde junio 2026, notificando al gestor por Telegram en tiempo real.',
      tags: ['n8n', 'Meta API', 'OpenAI GPT-4o', 'Google Sheets', 'Telegram'],
      emoji: '🤖',
      accent: '#c084fc'
    },
    {
      num: '02',
      title: 'Olivia',
      subtitle: 'Bot WhatsApp — Turnos & Cotizador',
      description: 'Cotizar un trámite DNRPA por WhatsApp a mano implica sostener una conversación larga sin perder el hilo: quién es comprador, quién vendedor, qué documentación falta. Diseñé Olivia como una máquina de estados (75 nodos) en vez de un flujo lineal, porque un chat real no avanza en orden — la gente manda audios, vuelve atrás, pregunta dos cosas a la vez. Resolví casos que rompían el conteo de DNI/CUIL con formatos irregulares y agregué un fallback para mensajes no soportados, para que el bot nunca se quedara mudo. Hoy agenda turnos reales en Google Calendar con recordatorios automáticos.',
      tags: ['n8n', 'WhatsApp Business API', 'OpenAI', 'Google Calendar', 'PostgreSQL'],
      emoji: '📅',
      accent: '#38bdf8'
    },
    {
      num: '03',
      title: 'Facturador SaaS',
      subtitle: 'Facturación automática para monotributistas',
      description: 'Un monotributista que factura manualmente pierde tiempo por cada venta: entrar a AFIP, cargar el comprobante, mandarlo por mail. El desafío no era automatizar ese paso, era hacerlo multi-tenant sin que un cliente pudiera ver ni tocar las credenciales de otro — cada uno conecta su propia cuenta de Mercado Pago y su propio certificado AFIP. Por eso las credenciales se guardan cifradas con AES-256 en vez de en texto plano: un problema de seguridad, no solo de features. El sistema detecta el pago aprobado, pide confirmación por email y emite la Factura C con QR oficial (RG 4291/2018) automáticamente.',
      tags: ['n8n', 'Mercado Pago API', 'AFIP WSFE', 'PostgreSQL', 'Gotenberg', 'Docker'],
      emoji: '🧾',
      accent: '#64ffda'
    },
    {
      num: '04',
      title: 'AxSalud',
      subtitle: 'Búsqueda de prestadores médicos con IA',
      description: 'El buscador oficial de la Superintendencia de Salud es rígido: hay que saber el nombre exacto de la obra social y del prestador para encontrar algo, y la mayoría de la gente no lo sabe. Con una base de 130.000 prestadores reales, armé un bot de Telegram donde el usuario escribe en lenguaje natural — "kinesiólogo en Quilmes que atienda OSDE" — y GPT-4o-mini interpreta la intención sobre datos públicos mal indexados, devolviendo dirección y teléfono sin que el usuario tenga que adivinar la nomenclatura oficial.',
      tags: ['Telegram Bot', 'GPT-4o-mini', 'PostgreSQL', 'n8n', 'SSalud API'],
      emoji: '🏥',
      accent: '#f472b6'
    },
    {
      num: '05',
      title: 'Wara',
      subtitle: 'Vendedora IA — Electrodomésticos',
      description: 'Un distribuidor mayorista/minorista de electrodomésticos necesita atender dos tipos de cliente distinto — el que compra para revender y el que compra para su casa — con precios y tono distintos, y no siempre hay alguien disponible para responder en el momento. Wara resuelve eso con lógica de precio diferenciado por perfil de cliente, no un catálogo fijo, y vuelca cada consulta a Google Sheets para que el equipo comercial haga seguimiento en vez de perder el lead en el historial de chat.',
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
