import { useAppBridge } from "@shopify/app-bridge-react";
import { ClientProps, LoaderData } from "./route";
import { useCallback, useEffect, useState } from "react";
import { List, Page } from "@shopify/polaris";
import { ResponseMessage } from "app/models/FunctionResponse";
import { Product } from "app/domain/product/model/Product";

const Client: React.FC<ClientProps> = ({ loaderData, actionData }) => {
    const shopify = useAppBridge();
    const [products, setProducts] = useState<LoaderData["products"]>([]);
    const showToastMessages = useCallback((responses: ResponseMessage[]) => {
        let currentIndex = 0; // Track the current message index
        const showNextMessage = () => {
          if (currentIndex < responses.length) {
            const currentMessage = responses[currentIndex];
            shopify.toast.show(currentMessage.message, {
              isError: currentMessage.isError,
              onDismiss: () => {
                currentIndex++; // Move to the next message
                showNextMessage(); // Show the next message
              },
            });
          }
        };
        // Start showing messages
        showNextMessage();
    }, [shopify]);
    useEffect(() => {
        if(loaderData?.products) {
            setProducts(loaderData.products);
        }
        if (loaderData?.toastMessages) {
            showToastMessages(loaderData.toastMessages);
        }
    },[loaderData])
    return (
        <Page fullWidth title="Export">
            <ProductList Products={products}></ProductList>
        </Page>
    )
}
export default Client;
interface props {
  Products: Product[];
}
const ProductList: React.FC<props> = ({ Products }) => {
  return (
    <List>
      {Products.map((p: Product) => (
        <List.Item key={p.id}>{p.handle}</List.Item>
      ))}
    </List>
  );
};