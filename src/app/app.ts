import { Component, HostListener, signal } from '@angular/core';

interface Project {
  num: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  emoji: string;
  accent: string;
  link?: string;
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
export class App {
  scrolled = signal(false);
  menuOpen = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 50);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  projects: Project[] = [
    {
      num: '01',
      title: 'Sofía',
      subtitle: 'Bot Instagram — Gestoría Automotor',
      description: 'Asistente virtual en Instagram que captura leads calificados para una gestoría automotor. Detecta el tipo de trámite (transferencia, 0km, inscripción), recolecta toda la documentación necesaria y notifica al gestor por Telegram en tiempo real. Activo con clientes reales desde junio 2026.',
      tags: ['n8n', 'Meta API', 'OpenAI GPT-4o', 'Google Sheets', 'Telegram'],
      emoji: '🤖',
      accent: '#c084fc'
    },
    {
      num: '02',
      title: 'Olivia',
      subtitle: 'Bot WhatsApp — Turnos & Cotizador',
      description: 'Bot de WhatsApp con máquina de estados que cotiza trámites DNRPA, gestiona el perfil del comprador/vendedor, verifica documentación pendiente y agenda turnos en Google Calendar. Incluye recordatorios automáticos y callbacks para confirmar o cancelar.',
      tags: ['n8n', 'WhatsApp Business API', 'OpenAI', 'Google Calendar', 'PostgreSQL'],
      emoji: '📅',
      accent: '#38bdf8'
    },
    {
      num: '03',
      title: 'Facturador SaaS',
      subtitle: 'Facturación automática para monotributistas',
      description: 'Sistema multi-tenant que detecta pagos aprobados en Mercado Pago, pide confirmación al monotributista por email y emite la Factura C ante AFIP automáticamente. Genera PDF con QR oficial (RG 4291/2018) y lo envía al cliente. Credenciales cifradas con AES-256.',
      tags: ['n8n', 'Mercado Pago API', 'AFIP WSFE', 'PostgreSQL', 'Gotenberg', 'Docker'],
      emoji: '🧾',
      accent: '#64ffda'
    },
    {
      num: '04',
      title: 'AxSalud',
      subtitle: 'Búsqueda de prestadores médicos con IA',
      description: 'Bot de Telegram que busca prestadores médicos de la Superintendencia de Salud con lenguaje natural. Base de 130.000 prestadores reales. El usuario escribe "cardiólogo en Palermo que atiende OSDE" y recibe los 5 más relevantes con dirección y teléfono.',
      tags: ['Telegram Bot', 'GPT-4o-mini', 'PostgreSQL', 'n8n', 'SSalud API'],
      emoji: '🏥',
      accent: '#f472b6'
    },
    {
      num: '05',
      title: 'Wara',
      subtitle: 'Vendedora IA — Electrodomésticos',
      description: 'Bot vendedora en Telegram para distribuidor mayorista/minorista de electrodomésticos. Responde consultas de stock, precios diferenciados por perfil de cliente, captura leads y los guarda en Google Sheets para seguimiento del equipo de ventas.',
      tags: ['Telegram Bot', 'Gemini AI', 'Google Sheets', 'n8n'],
      emoji: '🛒',
      accent: '#fb923c'
    }
  ];

  skills: Skill[] = [
    { name: 'n8n', icon: '⚡' },
    { name: 'Angular 18', icon: '🅰️' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'OpenAI', icon: '🧠' },
    { name: 'Gemini AI', icon: '✨' },
    { name: 'WhatsApp API', icon: '💬' },
    { name: 'Meta API', icon: '📸' },
    { name: 'Mercado Pago', icon: '💳' },
    { name: 'AFIP / WSFE', icon: '🏛️' },
    { name: 'Docker', icon: '🐳' },
    { name: 'Oracle Cloud', icon: '☁️' },
    { name: 'Python', icon: '🐍' },
    { name: 'TypeScript', icon: '📘' },
  ];
}
