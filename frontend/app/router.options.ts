import type { RouterConfig } from '@nuxt/schema';

const activeClass = 'router-link-active';
const exactActiveClass = 'router-link-exact-active';

export default <RouterConfig>{
  // scroll to hash, useful for using to="#some-id" in NuxtLink
  // ex: <NuxtLink to="#top"> To Top </ NuxtLink>
  scrollBehavior: (to, from, savedPosition) => {
    const nuxtLinks = document.querySelectorAll(`.${activeClass}`);

    if (to.hash) {
      const active = Array.from(nuxtLinks).find((el: HTMLAnchorElement) => {
        return el.href.includes(to.fullPath);
      });

      if (active) {
        nuxtLinks.forEach(
          (el) => (el.className = el.className.replaceAll(exactActiveClass, ''))
        );
        active.classList.add(exactActiveClass);
      }

      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }

    // If link is to same page, scroll to top with smooth behavior
    if (to === from) {
      return {
        left: 0,
        top: 0,
        behavior: 'smooth',
      };
    }

    // This will use saved scroll position on browser forward/back navigation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          left: savedPosition?.left || 0,
          top: savedPosition?.top || 0,
        });
      }, 500);
    });
  },
};