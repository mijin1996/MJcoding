using System.Collections.Generic;
using UnityEngine;

public class GoblinSpawn : MonoBehaviour {
    public Goblin goblinPrefab;
    public GoblinData[] goblinDatas;
    public Transform[] spawnPoints;
    private List<Goblin> goblins = new List<Goblin>();
    private int wave;
    
    private void Update() {
        if (GM.instance != null && GM.instance.isGameover) {
            return;
        }
        if (goblins.Count <= 0) {
            SpawnWave();
        }
        UpdateUI();
    }

    private void UpdateUI() {
        UIM.instance.UpdateWaveText(wave, goblins.Count);
    }

    private void SpawnWave() {
        wave++;
        int spawnCount = Mathf.RoundToInt(wave * 1.5f);
        for (int i = 0; i < spawnCount; i++) {
            CreateGoblin();
        }
    }

    private void CreateGoblin() {
        GoblinData goblinData = goblinDatas[Random.Range(0, goblinDatas.Length)];
        Transform spawnPoint = spawnPoints[Random.Range(0, spawnPoints.Length)];
        Goblin goblin = Instantiate(goblinPrefab, spawnPoint.position, spawnPoint.rotation);
        goblin.Setup(goblinData);
        goblins.Add(goblin);
        goblin.onDeath += () => goblins.Remove(goblin);
        goblin.onDeath += () => Destroy(goblin.gameObject, 10f);
        goblin.onDeath += () => GM.instance.AddScore(100);
    }
}
