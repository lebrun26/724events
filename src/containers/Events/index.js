import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  // filtre sur le type d'evenement
  const filteredEvents = (data?.events || []).filter(
    (event) => !type || event.type === type
  );
  // console.log("evenement filtre: ", filteredEvents);
  // console.log("type initial: ", type);
  // Mise en place de la pagination
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const changeType = (evtType) => {
    // console.log("type selectionner: ", evtType);
    setCurrentPage(1);
    setType(evtType);
  };
  const pageNumber = Math.ceil(filteredEvents.length / PER_PAGE);
  const typeList = new Set(data?.events.map((event) => event.type));
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => changeType(value || null)}
          />
          <div id="events" className="ListContainer">
            {paginatedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
