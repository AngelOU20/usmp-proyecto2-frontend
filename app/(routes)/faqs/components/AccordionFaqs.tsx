import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { dataFaqs } from "./AccordionFaqs.data";
import React from "react";

export const AccordionFaqs = () => {
  return (
    <>
      {dataFaqs.map((data) => (
        <React.Fragment key={data.id}>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>{data.question}</AccordionTrigger>
              <AccordionContent>{data.answer}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </React.Fragment>
      ))}
    </>
  );
};
