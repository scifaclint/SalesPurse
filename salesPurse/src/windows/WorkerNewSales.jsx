import NewSaleContent from "../components/NewSales";
import { styles } from "../styles/worker";
import NavigationTabWorker from "../navigation/NavigationTabsWorke";
import { styled } from "../styles/mainWorkerSection";
const WorkerNewSales = () => {
  return (
    <>
      <div style={styled.container}>
        <NavigationTabWorker />
        <main style={styles.mainContent}>{<NewSaleContent />}</main>
      </div>
    </>
  );
};

export default WorkerNewSales;
