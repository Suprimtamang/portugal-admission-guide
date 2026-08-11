import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Stagger-in dashboard panels with GSAP (respects reduced motion).
 * @see https://gsap.com/ui/
 */
export function useDashboardMotion(deps = []) {
    const rootRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) {
            return undefined;
        }

        const reduce = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        const ctx = gsap.context(() => {
            const hero = root.querySelectorAll('[data-motion="hero"]');
            const cards = root.querySelectorAll('[data-motion="card"]');
            const rows = root.querySelectorAll('[data-motion="row"]');

            if (reduce) {
                gsap.set([hero, cards, rows], { clearProps: 'all', opacity: 1 });
                return;
            }

            gsap.from(hero, {
                y: 18,
                opacity: 0,
                duration: 0.55,
                ease: 'power3.out',
            });

            gsap.from(cards, {
                y: 28,
                opacity: 0,
                duration: 0.5,
                stagger: 0.07,
                ease: 'power2.out',
                delay: 0.12,
            });

            gsap.from(rows, {
                x: -12,
                opacity: 0,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power2.out',
                delay: 0.28,
            });
        }, root);

        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return rootRef;
}

export function useHoverLift(selector = '[data-lift]') {
    const rootRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) {
            return undefined;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }

        const nodes = Array.from(root.querySelectorAll(selector));
        const cleanups = nodes.map((el) => {
            const enter = () =>
                gsap.to(el, {
                    y: -4,
                    boxShadow: '6px 6px 0 rgb(20 24 28 / 0.12)',
                    duration: 0.22,
                    ease: 'power2.out',
                });
            const leave = () =>
                gsap.to(el, {
                    y: 0,
                    boxShadow: '3px 3px 0 rgb(20 24 28 / 0.08)',
                    duration: 0.28,
                    ease: 'power2.out',
                });
            el.addEventListener('mouseenter', enter);
            el.addEventListener('mouseleave', leave);
            return () => {
                el.removeEventListener('mouseenter', enter);
                el.removeEventListener('mouseleave', leave);
            };
        });

        return () => cleanups.forEach((fn) => fn());
    }, [selector]);

    return rootRef;
}
