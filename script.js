document.addEventListener("DOMContentLoaded", () => {
	const header = document.querySelector("header");
	const navigationLinks = document.querySelectorAll('nav a[href^="#"]');
	const sections = document.querySelectorAll("section[id]");

	const updateHeader = () => {
		header.classList.toggle("scrolled", window.scrollY > 20);
	};

	const setActiveLink = (sectionId) => {
		navigationLinks.forEach((link) => {
			const linkTarget = link.getAttribute("href").slice(1);
			const isMenuLink = sectionId === "menu" && linkTarget === "products";
			const isActive = linkTarget === sectionId || isMenuLink;
			link.classList.toggle("active", isActive);
			link.setAttribute("aria-current", isActive ? "page" : "false");
		});
	};

	navigationLinks.forEach((link) => {
		link.addEventListener("click", (event) => {
			const targetId = link.getAttribute("href").slice(1);

			if (!targetId) {
				event.preventDefault();
				return;
			}

			const target = document.getElementById(targetId);

			if (target) {
				event.preventDefault();
				target.scrollIntoView({ behavior: "smooth", block: "start" });
				history.replaceState(null, "", `#${targetId}`);
				setActiveLink(targetId);
			}
		});
	});

	const sectionObserver = new IntersectionObserver(
		(entries) => {
			const visibleSection = entries
				.filter((entry) => entry.isIntersecting)
				.sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

			if (visibleSection) {
				setActiveLink(visibleSection.target.id);
			}
		},
		{ rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
	);

	sections.forEach((section) => sectionObserver.observe(section));
	window.addEventListener("scroll", updateHeader, { passive: true });
	updateHeader();
	setActiveLink(window.location.hash.slice(1) || "home");
});
