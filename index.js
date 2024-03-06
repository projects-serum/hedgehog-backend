const ethers = require("ethers")
const abi = require("./abi.json")
const provider = new ethers.JsonRpcProvider("https://base-sepolia-rpc.publicnode.com")
const wallet = new ethers.Wallet("0xc57dab39187abaec90f5a470f208cb4fdbd952544f2a040353f111a296ff87aa").connect(provider)
const contract = new ethers.Contract("0x2f847Dbf9f0F14b98b9053bFd49B52d4e1f84cD3", abi, wallet)

async function main() {
    const date = Math.floor(Date.now() / 1000)
    const data = await contract.info()
    const expire = parseFloat(data[1])
    if (expire < date) {
        return true
    } else {
        return false
    }

}

provider.on("block", async (blk) => {
    const end = await main()
    if (end) {
        const data = await contract.info()
        if (data[4] > 0) {
            try {
                await contract.DrawWinnerTicket()
            } catch (error) {
                console.log(error.message)
            }
        } else {
            try {
                await contract.restartDraw()
            } catch (error) {
                console.log(error.message)
            }

        }
    } else {
        console.log(end)
    }
})