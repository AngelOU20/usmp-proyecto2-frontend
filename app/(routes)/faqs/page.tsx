import React from "react";
import { AccordionFaqs } from "./components/AccordionFaqs";

export default function FaqsPage() {
  return (
    <div className="max-w-4xl p-6 mx-auto rounded-lg shadow-md bg-background">
      <div className="mb-5">
        <h2 className="mb-8 text-3xl font-semibold">
          Preguntas Frecuentes (FAQS)
        </h2>
        <p className="mb-2">
          Bienvenido a la sección de Preguntas Frecuentes (FAQs) diseñada para
          brindarte respuestas rápidas y claras sobre el sistema de gestión de
          proyectos de investigación para la Facultad de Ingeniería y
          Arquitectura de la Universidad de San Martín de Porres. Aquí
          encontrarás respuestas a las preguntas más comunes sobre el uso y las
          características de la aplicación que estamos desarrollando. Desde cómo
          acceder a la plataforma hasta cómo consultar los avances de un
          proyecto, hemos reunido una lista de preguntas frecuentes para
          garantizar que tengas la mejor experiencia posible.
        </p>
        <p className="mb-2">
          Nuestro equipo se ha esforzado por proporcionar respuestas detalladas
          y fáciles de entender para que puedas obtener la información que
          necesitas de manera rápida y sencilla. Si no encuentras la respuesta
          que buscas, no dudes en contactarnos. Estamos aquí para ayudarte en
          cada paso del camino.
        </p>
        <p className="mb-2">
          Explora nuestras FAQs y descubre cómo la aplicación puede ayudarte a
          optimizar el seguimiento y evaluación de los proyectos de
          investigación.
        </p>
      </div>
      <AccordionFaqs />
    </div>
  );
}
