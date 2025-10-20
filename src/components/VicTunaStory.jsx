// Placeholder for VicTunaStory component (translated to English)
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, Calendar } from 'lucide-react';
import MyCountdown from './CountDown';

export default function VicTunaStory() {
  const slides = [
    {
      id: 'cover',
      title: 'Hi,',
      couple: 'We are Tuan Tang & Dinh Huynh',
      subtitle: 'Monday, 29/12/2025',
      bg: 'https://images.unsplash.com/photo-1760263461531-8f07835a6c13?auto=format&fit=crop&w=1600&q=80',
      content: 'This is a small website from Tuan and Dinh to tell you — we are officially tying the knot!',
      bgPosition: 'left'
    },
    {
      id: 'story',
      title: 'Our Story',
      subtitle: '542+ peaceful days',
      bg: 'https://images.unsplash.com/photo-1760263799094-5372a1540c87?auto=format&fit=crop&w=1600&q=80',
      content: 'After all, it was that calm and comfortable peace that made us decide to spend the rest of our lives together.'
    },
    {
      id: 'gallery',
      title: 'Pre-Wedding',
      subtitle: 'A few captured moments',
      bg: '',
      images: [
        'https://images.unsplash.com/photo-1760263951964-5532a1ab4f77?auto=format&fit=crop&w=1200&q=60',
        'https://images.unsplash.com/photo-1760263952071-0869d0abd4bd?auto=format&fit=crop&w=1200&q=60',
        'https://images.unsplash.com/photo-1760263952010-2a6f1758e284?auto=format&fit=crop&w=1200&q=60',
        'https://images.unsplash.com/photo-1760263951902-56c97d157626?auto=format&fit=crop&w=1200&q=60',
        'https://images.unsplash.com/photo-1760263952890-a93e531a3da7?auto=format&fit=crop&w=1200&q=60',
        'https://images.unsplash.com/photo-1760263951959-6e04ad8fa660?auto=format&fit=crop&w=1200&q=60'
      ]
    },
    {
      id: 'betrothalCeremony',
      title: 'Betrothal - 過大禮',
      subtitle: '25 December 2025 — 08:00 AM',
      bg: 'https://images.unsplash.com/photo-1760264228685-dbf766fe08fc?auto=format&fit=crop&w=1600&q=80',
      venue: 'At Home, Binh Tay Ward, Ho Chi Minh. Followed by lunch at Văn Hoa Restaurant.'
    },
    {
      id: 'bigbigday',
      title: 'Big Big Day - 大日子',
      subtitle: '29 December 2025 — 08:00 AM',
      bg: 'https://images.unsplash.com/photo-1760263952890-a93e531a3da7?auto=format&fit=crop&w=1600&q=80',
      venue: 'At Home, Binh Tay Ward, Ho Chi Minh. Followed by lunch and dinner at Văn Hoa Restaurant.'
    },
    {
      id: 'rsvp',
      title: 'Will you come?',
      subtitle: 'Let us know so we can prepare warmly for you',
      bg: 'https://images.unsplash.com/photo-1760463603459-15841811bd99?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'thanks',
      title: 'We can’t wait to see you',
      subtitle: 'On the most meaningful day of our lives',
      bg: 'https://images.unsplash.com/photo-1760264228714-96d1677969df?auto=format&fit=crop&w=1600&q=80',
      // content: 'If you have any questions, please contact: hello@example.com'
      content: ''
    }
  ];

  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [rsvp, setRsvp] = useState({ name: '', coming: 'yes', guests: 1, phoneNumber: '', note: '' });
  const [status, setStatus] = useState(null);
  const containerRef = useRef(null);
  const [bgPositions, setBgPositions] = useState({});
  const [loading, setLoadng] = useState(false);

  useEffect(() => {
  function onKey(e) {
    if (lightbox) return; // prevent navigation if lightbox is open
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  }
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, [lightbox]);

  useEffect(() => {
  const el = containerRef.current;
  if (!el) return;
  function onWheel(e) {
    if (lightbox) return; // prevent navigation if lightbox is open
    if (Math.abs(e.deltaY) > 20) {
      if (e.deltaY > 0) next();
      else prev();
    }
  }
  el.addEventListener('wheel', onWheel, { passive: true });
  return () => el.removeEventListener('wheel', onWheel);
}, [lightbox]);

  // Auto-calculate background positions
  useEffect(() => {
    slides.forEach((slide) => {
      if (!bgPositions[slide.id]) {
        getAutoBgPosition(slide.bg, (pos) => {
          setBgPositions((prev) => ({ ...prev, [slide.id]: pos }));
        });
      }
    });
  }, []);

  useEffect(() => {
    const nextSlide = slides[index + 1];
    if (nextSlide?.bg) {
      const img = new Image();
      img.src = nextSlide.bg;
    }
  }, [index]);

  useEffect(() => {
    const images = document.querySelectorAll('.lazy-img');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    images.forEach((img) => observer.observe(img));
    return () => observer.disconnect();
  }, []);


  function next() { setIndex(i => Math.min(i + 1, slides.length - 1)); }
  function prev() { setIndex(i => Math.max(i - 1, 0)); }

  async function submitRsvp(e) {
    e.preventDefault();
    if (!rsvp.name.trim()) {
      setStatus({ ok: false, msg: 'Please enter your name.' });
      return;
    }

    if (rsvp.coming === "yes" && Number(rsvp.guests) <= 0) {
      setStatus({ ok: false, msg: 'Please enter valid number of guest.' });
      return;
    }

    setLoadng(true);
    setStatus({ ok: null, msg: 'Sending...' });
    try {    
      const res = await fetch('https://script.google.com/macros/s/AKfycbzMG5tqX_7m95r5mgzsl7N1jejv6MWDlVrkx7i3J2uiR66O6pwbkTLkGmGq8zRKunw/exec', {
        method: 'POST',
        body: JSON.stringify(rsvp),
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
        },
        mode: "no-cors"
      });

      const data = await res.json();
      if (data.ok) {
        setStatus({ ok: true, msg: 'Thank you! We’ve received your RSVP.' });
        setRsvp({ name: '', coming: 'yes', guests: 1, phoneNumber: '', note: '' });
        setLoadng(false);
      } else {
        throw new Error(data.message || 'Submission failed');
        setLoadng(false);
      }
    } catch (err) {
      setRsvp({ name: '', coming: 'yes', guests: 1, phoneNumber: '', note: '' });
      setStatus({ ok: true, msg: 'Thank you! We’ve received your RSVP.' });
      setTimeout(() => {
        setStatus(null);
      }, 3000)
      setLoadng(false);
    }
  }

  function calculateRealDays() {
    const begin = new Date(2023, 5, 5); // December is month 11 in JS Date
    const today = new Date();
    const diffTime = today - begin;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  // 🔍 Automatically detect the best background position
function getAutoBgPosition(src, callback) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    const aspect = img.width / img.height;
    let position = "center center";
    if (aspect < 0.8) position = "center 25%"; // portrait → focus higher
    else if (aspect < 1.3) position = "center 35%"; // square-ish
    else position = "center center"; // landscape
    callback(position);
  };
  img.onerror = () => callback("center center");
}

// 📱 Swipe-only navigation (improved)
useEffect(() => {
  const el = containerRef.current;
  if (!el) return;

  let startX = 0, startY = 0, endX = 0, endY = 0;
  let startTime = 0;
  const threshold = 60; // pixels
  const restraint = 80; // max vertical movement
  const allowedTime = 600; // ms

  const handleTouchStart = (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (['button', 'input', 'select', 'textarea', 'a', 'iframe', 'label'].includes(tag)) return;
    const touchObj = e.changedTouches[0];
    startX = touchObj.pageX;
    startY = touchObj.pageY;
    startTime = new Date().getTime(); // record time when finger first makes contact
  };

  const handleTouchEnd = (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (['button', 'input', 'select', 'textarea', 'a', 'iframe', 'label'].includes(tag)) return;

    const touchObj = e.changedTouches[0];
    endX = touchObj.pageX;
    endY = touchObj.pageY;

    const distX = endX - startX;
    const distY = endY - startY;
    const elapsedTime = new Date().getTime() - startTime;

    // Only trigger if swipe happened fast and mostly horizontal
    if (elapsedTime <= allowedTime && Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
      if (distX < 0) setIndex((i) => Math.min(i + 1, slides.length - 1)); // swipe left → next
      else setIndex((i) => Math.max(i - 1, 0)); // swipe right → prev
    }

    // reset
    startX = startY = endX = endY = 0;
  };

  el.addEventListener('touchstart', handleTouchStart, { passive: true });
  el.addEventListener('touchend', handleTouchEnd, { passive: true });

  return () => {
    el.removeEventListener('touchstart', handleTouchStart);
    el.removeEventListener('touchend', handleTouchEnd);
  };
}, []);


const slide = slides[index];
  const bgPos =
    slide.bgPosition ||
    bgPositions[slide.id] ||
    (window.innerWidth < 768 ? "center 25%" : "center center");

  return (
    <div className="min-h-screen bg-gray-900 text-white select-none overflow-hidden" ref={containerRef}>
      <header className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between">
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-3">
          <button onClick={() => setIndex(0)} className="text-sm font-semibold">Home</button>
          <nav className="hidden sm:flex gap-2">
            {slides.map((s, i) => (
              <button key={s.id} onClick={() => setIndex(i)} className={`text-sm px-3 py-1 rounded-xl ${i===index ? 'bg-white/20' : 'hover:bg-white/5'}`}>
                {s.title}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-black/40 rounded-2xl p-2 flex gap-2">
            <button onClick={prev} aria-label="Previous" className="p-2 rounded-full hover:bg-white/5"><ArrowLeft size={18} /></button>
            <button onClick={next} aria-label="Next" className="p-2 rounded-full hover:bg-white/5"><ArrowRight size={18} /></button>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden h-screen">
        {/* <AnimatePresence initial={false} exitBeforeEnter> */}
        <AnimatePresence mode="wait">
          <motion.section key={slides[index].id} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }} transition={{ type: 'spring', stiffness: 100, damping: 18 }} className="h-screen w-full absolute inset-0 flex items-center justify-center">                      
            <motion.div
              key={slides[index].bg}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-no-repeat will-change-transform will-change-opacity"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.65)), url(${slides[index].bg})`,
                backgroundPosition: bgPos,
                backgroundSize: "cover",
              }}
              loading="eager" decoding="async"
            />
            <div className={slides[index].id === 'thanks' ? "relative z-10 max-w-6xl mx-auto px-6 py-12 w-full mt-60" : "relative z-10 max-w-6xl mx-auto px-6 py-12 w-full"}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  {(slides[index].id !== 'rsvp') && (
                    <h1 className="text-4xl md:text-5xl leading-tight">{slides[index].title}</h1>
                  )}
                  {slides[index].couple && <p className="text-3xl font-semibold mt-2 font-amsterdam">{slides[index].couple}</p>}
                  {(slides[index].id !== 'story') && (
                    <p className="mt-3 text-sm uppercase tracking-widest flex items-center gap-2 text-white/90"><Calendar size={16} /> {slides[index].subtitle}</p>
                  )}
                  {(slides[index].id === 'story') && (
                    <p className="mt-3 text-sm uppercase tracking-widest flex items-center gap-2 text-white/90"><Calendar size={16} /> 
                      {`${calculateRealDays()}+ been together`}
                    </p>
                  )}
                  {slides[index].content && <p className="mt-6 max-w-xl text-gray-100/95">{slides[index].content}</p>}

                  {slides[index].id === 'betrothalCeremony' && (
                    <div className="mt-8 bg-white/5 rounded-2xl p-6 max-w-md mt-30-iphone">
                      <div className="bg-white/5 rounded-2xl overflow-hidden bg-black/20 mb-5">
                         {/* Replace src with a real Google Maps embed link for the venue */}
                         {(slides[index].id === 'betrothalCeremony') && (
                           <iframe title="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30132.86869326541!2d106.6298410201124!3d10.755837270271355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752efb7d184b87%3A0xab92c1d33fffeb7!2sDistrict%205%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam!5e1!3m2!1sen!2s!4v1760123320279!5m2!1sen!2s" className="w-full h-full border-0" loading="lazy" />
                         )}                        
                      </div>
                      <h3 className="font-semibold">{slides[index].venue}</h3>
                      <p className="mt-2 text-sm">Time: 12:00 AM — 25/12/2025</p>
                      {/* <a href="#map" onClick={(e)=>e.preventDefault()} className="mt-3 inline-flex items-center gap-2 text-sm underline"><MapPin size={14} /> View map</a> */}
                    </div>
                    
                  )}

                  {slides[index].id === 'bigbigday' && (
                    <div className="mt-8 bg-white/5 rounded-2xl p-6 max-w-md mt-30-iphone">
                      <div className="h-48 bg-white/5 rounded-2xl overflow-hidden bg-black/20 mb-5">
                         {/* Replace src with a real Google Maps embed link for the venue */}
                         {(slides[index].id === 'bigbigday') && (
                           <iframe title="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.647780646341!2d106.6619153748565!3d10.752698289394612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f5dfe64ff03%3A0x9fcd311260c552f!2sVan%20Hoa%20Restaurant!5e1!3m2!1sen!2s!4v1760123178192!5m2!1sen!2s" className="w-full h-full border-0" loading="lazy" />
                         )}                        
                      </div>
                      <h3 className="font-semibold">{slides[index].venue}</h3>
                      <p className="mt-2 text-sm">Time: 6:00 PM — 25/12/2025</p>
                      {/* <a href="#map" onClick={(e)=>e.preventDefault()} className="mt-3 inline-flex items-center gap-2 text-sm underline"><MapPin size={14} /> View map</a> */}
                    </div>
                  )}

                  {slides[index].id === 'rsvp' && (
                    <form onSubmit={submitRsvp} className="mt-8 max-w-md">
                      <label className="block text-sm">Your name</label>
                      <input disabled={loading} required className="mt-2 w-full rounded-xl bg-white/5 p-3" value={rsvp.name} onChange={(e)=>setRsvp({...rsvp, name:e.target.value})} />

                      <label className="block text-sm mt-4">Will you attend?</label>
                      <select className="mt-2 rounded-xl bg-white/5 p-3 w-40" value={rsvp.coming} onChange={(e)=>setRsvp({...rsvp, coming:e.target.value})}>
                        <option value="yes">Yes — I’ll be there</option>
                        <option value="no">No — sending love</option>
                      </select>

                      <label className="block text-sm mt-4">Number of guests</label>
                      <input disabled={loading} required type="number" min={1} className="mt-2 w-32 rounded-xl bg-white/5 p-3" value={rsvp.guests} onChange={(e)=>setRsvp({...rsvp, guests: Number(e.target.value)})} />

                      <label className="block text-sm mt-4">Phone Number/ Zalo - Please input valid phone number</label>
                      <input disabled={loading} required type="number" className="mt-2 w-full rounded-xl bg-white/5 p-3" value={rsvp.phoneNumber} onChange={(e)=>setRsvp({...rsvp, phoneNumber: e.target.value})} />                  

                      <label className="block text-sm mt-4">Any blessings for us?</label>
                      <textarea disabled={loading} className="mt-2 w-full rounded-xl bg-white/5 p-3" rows={3} value={rsvp.note} onChange={(e)=>setRsvp({...rsvp, note: e.target.value})} />

                      <div className="mt-4 flex items-center gap-3">
                        <button disabled={loading} className="px-5 py-2 rounded-xl bg-white text-black font-semibold">Send</button>
                        {status && (<span className={`text-sm ${status.ok ? 'text-green-300' : 'text-rose-300'}`}>{status.msg}</span>)}
                      </div>
                    </form>
                  )}
                </div>

                <div>
                  {slides[index].id === 'gallery' && (
                    <div className="grid grid-cols-2 gap-3">
                      {slides[index].images.map((src,i)=> (
                        <button key={i} onClick={()=>setLightbox(src)} className="rounded-xl overflow-hidden aspect-[4/3]">
                          <img src={src} alt={`Photo ${i+1}`} className="w-full h-full object-cover transform hover:scale-105 transition" loading="lazy"decoding="async"
                            srcSet={`${src}?w=400 400w, ${src}?w=800 800w, ${src}?w=1200 1200w`}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* {(slides[index].id === 'cover' || slides[index].id === 'thanks') && ( */}
                  {(slides[index].id === 'cover') && (
                    <div className="bg-white/5 rounded-3xl p-6 max-w-sm">
                      {slides[index].id === 'cover' && (
                        <>
                          <MyCountdown targetDate={new Date("2025-12-29T08:00:00")} />
                        </>
                      )}
                      {/* {slides[index].id === 'thanks' && (
                        <>
                          <p className="font-medium">{slides[index].subtitle}</p>
                          <p className="mt-3 text-sm">{slides[index].couple ? slides[index].couple : 'Tuan Tang & Dinh Huynh'}</p>
                        </>
                      )} */}
                    </div>
                  )}

                  {(slides[index].id === 'betrothalCeremony' || slides[index].id === 'bigbigday') && (
                    // <div className="bg-white/6 rounded-3xl p-6 max-w-md">
                    //   <div className="h-48 rounded-xl overflow-hidden bg-black/20">
                    //     {/* Replace src with a real Google Maps embed link for the venue */}
                    //     {(slides[index].id === 'betrothalCeremony') && (
                    //       <iframe title="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30132.86869326541!2d106.6298410201124!3d10.755837270271355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752efb7d184b87%3A0xab92c1d33fffeb7!2sDistrict%205%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam!5e1!3m2!1sen!2s!4v1760123320279!5m2!1sen!2s" className="w-full h-full border-0" loading="lazy" />
                    //     )}
                    //     {(slides[index].id === 'bigbigday') && (
                    //       <iframe title="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.647780646341!2d106.6619153748565!3d10.752698289394612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f5dfe64ff03%3A0x9fcd311260c552f!2sVan%20Hoa%20Restaurant!5e1!3m2!1sen!2s!4v1760123178192!5m2!1sen!2s" className="w-full h-full border-0" loading="lazy" />
                    //     )}
                    //   </div>
                    //   <div className="mt-4 text-sm">
                    //     <p className="font-semibold">Location</p>
                    //     <p className="mt-2">{slides[index].venue}</p>
                    //   </div>
                    // </div>
                    <></>
                  )}

                  
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((s,i)=> (
                <button key={s.id} onClick={()=>setIndex(i)} className={`w-3 h-3 rounded-full ${i===index ? 'bg-white' : 'bg-white/30'}`} aria-label={`Go to ${s.title}`} />
              ))}
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={()=>setLightbox(null)}>
            <motion.img src={lightbox} alt="Enlarged" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* <div className="fixed left-4 bottom-4 z-40 bg-black/40 rounded-xl px-3 py-2 text-xs">Swipe / scroll to navigate • ← → to move</div> */}
    </div>
  );
}
