export async function createWebsocket(url) {
    let reconnecting = false;
    let wss;
    const reconnect = (url, resolve) => {
        if (!reconnecting) {
            console.log('reconnecting');
            reconnecting = true;
            setTimeout(async () => {
                reconnecting = false;
                resolve(await connect(url));
            }, 1000);
        }
    };
    const connect = (url) => {
        return new Promise((resolve, reject) => {
            wss = new WebSocket(url);
            wss.onerror = async () => {
                reconnect(url, resolve);
            };
            wss.onopen = () => {
                resolve(wss);
            };
            wss.onclose = () => {
                connect(url);
            };
        });
    };
    return connect(url);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVjb25uZWN0aW5nV1MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvV2ViUlRDL1JlY29ubmVjdGluZ1dTLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE1BQU0sQ0FBQyxLQUFLLFVBQVUsZUFBZSxDQUFDLEdBQVc7SUFDaEQsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFBO0lBQ3hCLElBQUksR0FBYyxDQUFBO0lBQ2xCLE1BQU0sU0FBUyxHQUFHLENBQUMsR0FBVyxFQUFFLE9BQTRELEVBQUUsRUFBRTtRQUMvRixJQUFHLENBQUMsWUFBWSxFQUFFO1lBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7WUFDM0IsWUFBWSxHQUFHLElBQUksQ0FBQTtZQUNuQixVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ3JCLFlBQVksR0FBRyxLQUFLLENBQUE7Z0JBQ3BCLE9BQU8sQ0FBQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1lBQzVCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUNSO0lBQ0YsQ0FBQyxDQUFBO0lBQ0QsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRTtRQUMvQixPQUFPLElBQUksT0FBTyxDQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ2pELEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN4QixHQUFHLENBQUMsT0FBTyxHQUFHLEtBQUssSUFBSSxFQUFFO2dCQUN4QixTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQ3hCLENBQUMsQ0FBQTtZQUNELEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO2dCQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDYixDQUFDLENBQUE7WUFDRCxHQUFHLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtnQkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ2IsQ0FBQyxDQUFBO1FBQ0YsQ0FBQyxDQUFDLENBQUE7SUFDSCxDQUFDLENBQUE7SUFDRCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNwQixDQUFDIn0=