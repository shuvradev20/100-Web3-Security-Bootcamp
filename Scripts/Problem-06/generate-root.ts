import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

const values = [
    ["0x1111111111111111111111111111111111111111", "1"],
    ["0x2222222222222222222222222222222222222222", "1"]
]

const tree = StandardMerkleTree.of(values, ["address", "uint256"]);

console.log("Markle Root", tree.root);

fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));
