const ethers = require("ethers")
const abi = require("./abi.json")
const provider = new ethers.JsonRpcProvider("https://base-pokt.nodies.app")
const wallet = new ethers.Wallet(process.env.PK).connect(provider)
const contract = new ethers.Contract("0x87F25e688403CA03746EC68fEF61AF0EAed11e4C", abi, wallet)
require('dotenv').config();

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
