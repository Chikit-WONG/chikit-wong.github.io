document.getElementById('year').textContent = new Date().getFullYear();

const menuButton = document.getElementById('menu-button');
const nav = document.getElementById('site-nav');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? 'Close' : 'Menu';
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu';
  });
});

const certificateLinks = [
  {
    title: 'Mathematical Contest in Modeling (MCM) — Finalist',
    links: [
      ['Certificate', 'certificates.html#mcm-finalist-2026'],
    ],
  },
  {
    title: 'Sustainable Innovators Program Best Project Award — Third Prize',
    links: [
      ['Certificate', 'certificates.html#sustainable-innovators-third-prize-2026'],
    ],
  },
  {
    title: 'Academic Excellence Award and Outstanding Performance Award',
    links: [
      ['Academic Excellence Certificate', 'certificates.html#academic-excellence-award-2026'],
      ['Outstanding Performance Certificate', 'certificates.html#outstanding-performance-award-2026'],
    ],
  },
];

certificateLinks.forEach(({ title, links }) => {
  const heading = Array.from(document.querySelectorAll('#honors .timeline-item h3'))
    .find((element) => element.textContent.trim() === title);

  if (!heading) return;

  const description = heading.nextElementSibling;
  if (!description) return;

  links.forEach(([label, href]) => {
    description.append(document.createTextNode(' · '));

    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    link.target = '_blank';
    link.rel = 'noreferrer';
    description.append(link);
  });
});
